<?php

namespace Claroline\MindMeBillingBundle\Repository;

use Claroline\AppBundle\Persistence\Repository\AbstractRepository;
use Claroline\MindMeBillingBundle\Entity\Order;

/**
 * @extends AbstractRepository<Order>
 */
class OrderRepository extends AbstractRepository
{
    public function findByOutTradeNo(string $outTradeNo): ?Order
    {
        return $this->findOneBy(['outTradeNo' => $outTradeNo]);
    }

    /**
     * @return Order[]
     */
    public function findPendingExpired(): array
    {
        return $this->createQueryBuilder('o')
            ->where('o.status = :pending')
            ->andWhere('o.expiredAt < :now')
            ->setParameter('pending', 'pending')
            ->setParameter('now', new \DateTimeImmutable())
            ->getQuery()
            ->getResult();
    }
}
