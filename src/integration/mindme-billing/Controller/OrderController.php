<?php

namespace Claroline\MindMeBillingBundle\Controller;

use Claroline\MindMeBillingBundle\Manager\OrderManager;
use Claroline\MindMeBillingBundle\Payment\PaymentGatewayInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[Route(requirements: ['_format' => 'json'])]
class OrderController
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly OrderManager $orderManager,
        private readonly PaymentGatewayInterface $gateway,
    ) {
    }

    /**
     * Create a payment order and return payment params.
     */
    #[Route(path: '/api/billing/order', name: 'apiv2_mindme_billing_order_create', methods: ['POST'])]
    public function createAction(Request $request): JsonResponse
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        $data = json_decode($request->getContent(), true);

        $order = $this->orderManager->createOrder(
            $user,
            $data['trainingType'] ?? 'session',
            (int) ($data['trainingId'] ?? 0),
            (string) ($data['amount'] ?? '0.00'),
            $data['channel'] ?? 'wechat'
        );

        return new JsonResponse([
            'id' => $order->getUuid(),
            'outTradeNo' => $order->getOutTradeNo(),
            'status' => $order->getStatus(),
            'qrCodeUrl' => $order->getQrCodeUrl(),
            'redirectUrl' => $order->getRedirectUrl(),
            'expiredAt' => $order->getExpiredAt()->format(\DateTimeInterface::ATOM),
        ]);
    }

    /**
     * Query order status (used by frontend polling).
     */
    #[Route(path: '/api/billing/order/{uuid}/status', name: 'apiv2_mindme_billing_order_status', methods: ['GET'])]
    public function statusAction(string $uuid): JsonResponse
    {
        $this->orderManager->syncStatus(/* load order by uuid */);

        return new JsonResponse(['status' => 'pending']);
    }

    /**
     * WeChat Pay async callback.
     */
    #[Route(path: '/billing/callback/wechat', name: 'mindme_billing_callback_wechat', methods: ['POST'])]
    public function wechatCallbackAction(Request $request): Response
    {
        try {
            $outTradeNo = $this->gateway->handleCallback($request);
            $transactionId = $request->get('transaction_id') ?? '';
            $this->orderManager->markPaid($outTradeNo, $transactionId);

            return new Response(json_encode(['code' => 'SUCCESS']), 200, ['Content-Type' => 'application/json']);
        } catch (\Exception $e) {
            return new Response(json_encode(['code' => 'FAIL', 'message' => $e->getMessage()]), 500, ['Content-Type' => 'application/json']);
        }
    }

    /**
     * Alipay async callback.
     */
    #[Route(path: '/billing/callback/alipay', name: 'mindme_billing_callback_alipay', methods: ['POST'])]
    public function alipayCallbackAction(Request $request): Response
    {
        try {
            $outTradeNo = $this->gateway->handleCallback($request);
            $transactionId = $request->get('trade_no') ?? '';
            $this->orderManager->markPaid($outTradeNo, $transactionId);

            return new Response('success');
        } catch (\Exception $e) {
            return new Response('fail');
        }
    }
}
