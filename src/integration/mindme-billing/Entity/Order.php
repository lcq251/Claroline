<?php

namespace Claroline\MindMeBillingBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: Repository\OrderRepository::class)]
#[ORM\Table(name: 'claro_mindme_billing_order')]
#[ORM\Index(name: 'idx_order_user', columns: ['user_id'])]
#[ORM\Index(name: 'idx_order_status', columns: ['status'])]
class Order
{
    use Id;
    use Uuid;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    /** 'course' | 'session' */
    #[ORM\Column(type: Types::STRING, length: 50)]
    private string $trainingType;

    #[ORM\Column(type: Types::INTEGER)]
    private int $trainingId;

    /** Amount in yuan (元). */
    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private string $amount = '0.00';

    #[ORM\Column(type: Types::STRING, length: 10, options: ['default' => 'CNY'])]
    private string $currency = 'CNY';

    /** 'wechat' | 'alipay' */
    #[ORM\Column(type: Types::STRING, length: 20)]
    private string $channel;

    /** pending | paid | cancelled | expired | refunded */
    #[ORM\Column(type: Types::STRING, length: 20)]
    private string $status = OrderStatus::PENDING;

    /** Merchant order number. */
    #[ORM\Column(type: Types::STRING, length: 64, unique: true)]
    private string $outTradeNo;

    /** Third-party transaction ID (returned after payment). */
    #[ORM\Column(type: Types::STRING, length: 64, nullable: true)]
    private ?string $transactionId = null;

    /** QR code URL for WeChat Native pay. */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $qrCodeUrl = null;

    /** Redirect URL for Alipay. */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $redirectUrl = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $paidAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $expiredAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->refreshUuid();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->expiredAt = new \DateTimeImmutable('+15 minutes');
    }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): void { $this->user = $user; }

    public function getTrainingType(): string { return $this->trainingType; }
    public function setTrainingType(string $type): void { $this->trainingType = $type; }

    public function getTrainingId(): int { return $this->trainingId; }
    public function setTrainingId(int $id): void { $this->trainingId = $id; }

    public function getAmount(): string { return $this->amount; }
    public function setAmount(string $amount): void { $this->amount = $amount; }

    public function getCurrency(): string { return $this->currency; }
    public function setCurrency(string $currency): void { $this->currency = $currency; }

    public function getChannel(): string { return $this->channel; }
    public function setChannel(string $channel): void { $this->channel = $channel; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): void { $this->status = $status; }

    public function getOutTradeNo(): string { return $this->outTradeNo; }
    public function setOutTradeNo(string $no): void { $this->outTradeNo = $no; }

    public function getTransactionId(): ?string { return $this->transactionId; }
    public function setTransactionId(?string $id): void { $this->transactionId = $id; }

    public function getQrCodeUrl(): ?string { return $this->qrCodeUrl; }
    public function setQrCodeUrl(?string $url): void { $this->qrCodeUrl = $url; }

    public function getRedirectUrl(): ?string { return $this->redirectUrl; }
    public function setRedirectUrl(?string $url): void { $this->redirectUrl = $url; }

    public function getPaidAt(): ?\DateTimeImmutable { return $this->paidAt; }
    public function setPaidAt(?\DateTimeImmutable $at): void { $this->paidAt = $at; }

    public function getExpiredAt(): \DateTimeImmutable { return $this->expiredAt; }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
    public function getUpdatedAt(): \DateTimeImmutable { return $this->updatedAt; }
    public function setUpdatedAt(\DateTimeImmutable $at): void { $this->updatedAt = $at; }

    public function isPending(): bool { return OrderStatus::PENDING === $this->status; }
    public function isPaid(): bool { return OrderStatus::PAID === $this->status; }

    public function markPaid(string $transactionId): void
    {
        $this->status = OrderStatus::PAID;
        $this->transactionId = $transactionId;
        $this->paidAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function cancel(): void
    {
        $this->status = OrderStatus::CANCELLED;
        $this->updatedAt = new \DateTimeImmutable();
    }
}
