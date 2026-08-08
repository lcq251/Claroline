<?php

namespace Claroline\MindMeBillingBundle\Payment;

use Claroline\MindMeBillingBundle\Entity\Order;
use Symfony\Component\HttpFoundation\Request;
use Yansongda\Pay\Pay;

class WeChatPayGateway implements PaymentGatewayInterface
{
    private array $config;

    public function __construct(array $wechatConfig)
    {
        $this->config = $wechatConfig;
    }

    public function createPayment(Order $order): array
    {
        $payload = [
            'out_trade_no' => $order->getOutTradeNo(),
            'amount' => [
                'total' => (int) (floatval($order->getAmount()) * 100),
                'currency' => 'CNY',
            ],
            'description' => 'Claroline Payment #'.$order->getOutTradeNo(),
            'notify_url' => $this->config['notify_url'] ?? '',
        ];

        $response = Pay::wechat($this->config)->native($payload);

        return ['qr_code_url' => $response->code_url ?? ''];
    }

    public function handleCallback(Request $request): string
    {
        $data = Pay::wechat($this->config)->callback();

        // 'resource.ciphertext' is the decrypted transaction data
        $resource = $data['resource'] ?? [];
        $ciphertext = $resource['ciphertext'] ?? '';

        if ($ciphertext) {
            $decrypted = Pay::wechat($this->config)->decrypt($ciphertext);
            return $decrypted['out_trade_no'] ?? '';
        }

        return $data['out_trade_no'] ?? '';
    }

    public function queryStatus(string $outTradeNo): ?string
    {
        $response = Pay::wechat($this->config)->find([
            'out_trade_no' => $outTradeNo,
        ]);

        $tradeState = $response->trade_state ?? '';
        $transactionId = $response->transaction_id ?? null;

        // SUCCESS means the payment was completed
        if ('SUCCESS' === $tradeState) {
            return $transactionId;
        }

        return null;
    }
}
