<?php

namespace Claroline\MindMeBillingBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_billing_transaction')]
class Transaction
{
    use Id;
    use Uuid;

    #[ORM\ManyToOne(targetEntity: Order::class)]
    #[ORM\JoinColumn(name: 'order_id', nullable: false, onDelete: 'CASCADE')]
    private ?Order $order = null;

    /** 'payment' | 'refund' */
    #[ORM\Column(type: Types::STRING, length: 20)]
    private string $type;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private string $amount = '0.00';

    #[ORM\Column(type: Types::STRING, length: 64, nullable: true)]
    private ?string $channelTransactionId = null;

    /** Raw callback data for audit. */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $rawCallback = [];

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->refreshUuid();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getOrder(): ?Order { return $this->order; }
    public function setOrder(?Order $order): void { $this->order = $order; }

    public function getType(): string { return $this->type; }
    public function setType(string $type): void { $this->type = $type; }

    public function getAmount(): string { return $this->amount; }
    public function setAmount(string $amount): void { $this->amount = $amount; }

    public function getChannelTransactionId(): ?string { return $this->channelTransactionId; }
    public function setChannelTransactionId(?string $id): void { $this->channelTransactionId = $id; }

    public function getRawCallback(): ?array { return $this->rawCallback; }
    public function setRawCallback(?array $data): void { $this->rawCallback = $data; }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
