<?php

namespace Claroline\MindMeBillingBundle\Payment;

use Claroline\MindMeBillingBundle\Entity\Order;
use Symfony\Component\HttpFoundation\Request;

interface PaymentGatewayInterface
{
    /**
     * Create a payment order on the third-party platform.
     * Returns payment params: ['qr_code_url' => '...'] for WeChat Native,
     * or ['redirect_url' => '...'] for Alipay web.
     */
    public function createPayment(Order $order): array;

    /**
     * Handle the async callback notification from the payment platform.
     * Must return the out_trade_no of the paid order, or throw on failure.
     */
    public function handleCallback(Request $request): string;

    /**
     * Query payment status from the platform.
     */
    public function queryStatus(string $outTradeNo): ?string;
}
