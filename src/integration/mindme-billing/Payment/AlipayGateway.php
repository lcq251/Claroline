<?php

namespace Claroline\MindMeBillingBundle\Payment;

use Claroline\MindMeBillingBundle\Entity\Order;
use Symfony\Component\HttpFoundation\Request;
use Yansongda\Pay\Pay;

class AlipayGateway implements PaymentGatewayInterface
{
    private array $config;

    public function __construct(array $alipayConfig)
    {
        $this->config = $alipayConfig;
    }

    public function createPayment(Order $order): array
    {
        $payload = [
            'out_trade_no' => $order->getOutTradeNo(),
            'total_amount' => floatval($order->getAmount()),
            'subject' => 'Claroline Payment #'.$order->getOutTradeNo(),
            'notify_url' => $this->config['notify_url'] ?? '',
        ];

        $response = Pay::alipay($this->config)->web($payload);

        return ['redirect_url' => $response];
    }

    public function handleCallback(Request $request): string
    {
        $data = Pay::alipay($this->config)->callback();

        return $data['out_trade_no'] ?? '';
    }

    public function queryStatus(string $outTradeNo): ?string
    {
        $response = Pay::alipay($this->config)->find([
            'out_trade_no' => $outTradeNo,
        ]);

        $tradeStatus = $response->trade_status ?? '';
        $transactionId = $response->trade_no ?? null;

        if ('TRADE_SUCCESS' === $tradeStatus) {
            return $transactionId;
        }

        return null;
    }
}
