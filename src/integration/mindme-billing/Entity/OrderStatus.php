<?php

namespace Claroline\MindMeBillingBundle\Entity;

final class OrderStatus
{
    public const PENDING = 'pending';
    public const PAID = 'paid';
    public const CANCELLED = 'cancelled';
    public const EXPIRED = 'expired';
    public const REFUNDED = 'refunded';
}
