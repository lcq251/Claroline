<?php

namespace Claroline\CoreBundle\Event;

use Claroline\AppBundle\API\Finder\FinderQuery;
use Doctrine\ORM\QueryBuilder;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Event dispatched when an object is searched inside the app.
 */
class SearchObjectsEvent extends Event
{
    public function __construct(
        private readonly QueryBuilder $queryBuilder,
        private readonly string $objectAlias,
        private readonly FinderQuery $finderQuery
    ) {
    }

    public function getObjectAlias(): string
    {
        return $this->objectAlias;
    }

    public function getQueryBuilder(): QueryBuilder
    {
        return $this->queryBuilder;
    }

    public function getQuery(): FinderQuery
    {
        return $this->finderQuery;
    }
}
