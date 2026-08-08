<?php

namespace Claroline\MindMeBillingBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\MindMeBillingBundle\Entity\Order;
use Claroline\MindMeBillingBundle\Entity\OrderStatus;
use Claroline\MindMeBillingBundle\Entity\Transaction;
use Claroline\MindMeBillingBundle\Payment\PaymentGatewayInterface;
use Claroline\MindMeBillingBundle\Repository\OrderRepository;

class OrderManager
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly PaymentGatewayInterface $gateway,
    ) {
    }

    /**
     * Create a new unpaid order and call the payment gateway.
     */
    public function createOrder(User $user, string $trainingType, int $trainingId, string $amount, string $channel): Order
    {
        $order = new Order();
        $order->setUser($user);
        $order->setTrainingType($trainingType);
        $order->setTrainingId($trainingId);
        $order->setAmount($amount);
        $order->setChannel($channel);
        $order->setOutTradeNo($this->generateOutTradeNo());

        $this->om->persist($order);

        // Call the payment gateway to get QR code or redirect URL
        $result = $this->gateway->createPayment($order);

        if (!empty($result['qr_code_url'])) {
            $order->setQrCodeUrl($result['qr_code_url']);
        }
        if (!empty($result['redirect_url'])) {
            $order->setRedirectUrl($result['redirect_url']);
        }

        $this->om->forceFlush();

        return $order;
    }

    /**
     * Process a successful payment callback.
     */
    public function markPaid(string $outTradeNo, string $transactionId): Order
    {
        $repo = $this->getRepository();
        $order = $repo->findByOutTradeNo($outTradeNo);

        if (!$order || !$order->isPending()) {
            throw new \RuntimeException('Order not found or already processed.');
        }

        $order->markPaid($transactionId);

        $tx = new Transaction();
        $tx->setOrder($order);
        $tx->setType('payment');
        $tx->setAmount($order->getAmount());
        $tx->setChannelTransactionId($transactionId);
        $this->om->persist($tx);

        $this->om->forceFlush();

        return $order;
    }

    /**
     * Query the payment gateway for current order status.
     */
    public function syncStatus(Order $order): void
    {
        if (!$order->isPending()) {
            return;
        }

        $transactionId = $this->gateway->queryStatus($order->getOutTradeNo());

        if ($transactionId) {
            $this->markPaid($order->getOutTradeNo(), $transactionId);
        }
    }

    /**
     * Cancel pending orders that have expired.
     */
    public function cancelExpired(): int
    {
        $repo = $this->getRepository();
        $expiredOrders = $repo->findPendingExpired();
        $count = 0;

        foreach ($expiredOrders as $order) {
            $order->cancel();
            $this->om->persist($order);
            ++$count;
        }

        if ($count > 0) {
            $this->om->forceFlush();
        }

        return $count;
    }

    private function generateOutTradeNo(): string
    {
        return date('YmdHis').substr(bin2hex(random_bytes(4)), 0, 8);
    }

    /**
     * @return OrderRepository
     */
    private function getRepository(): OrderRepository
    {
        return $this->om->getRepository(Order::class);
    }
}
