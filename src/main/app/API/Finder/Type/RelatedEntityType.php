<?php

namespace Claroline\AppBundle\API\Finder\Type;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RelatedEntityType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        // allows to customize the join to the entity when the finder is embedded into another
        // the callback is called with the QueryBuilder, FinderInterface and resolved options as parameters.
        $resolver
            ->define('joinQuery')
            ->allowedTypes('callable');

        $resolver
            ->define('nullable')
            ->allowedTypes('boolean')
            ->default(false);
    }

    public function buildQuery(QueryBuilder $queryBuilder, FinderInterface $finder, array $options): void
    {
        if (null !== $finder->getFilterValue() || $options['nullable']) {
            if (isset($options['joinQuery'])) {
                $options['joinQuery']($queryBuilder, $finder, $options);
            } else {
                $queryBuilder->leftJoin($finder->getQueryPath(false), $finder->getAlias());
            }

            if (is_null($finder->getFilterValue())) {
                $queryBuilder->andWhere("{$finder->getAlias()} IS NULL");
                return;
            }

            if (is_array($finder->getFilterValue())) {
                $queryBuilder->andWhere("{$finder->getAlias()}.uuid = :{$finder->getAlias()}");
            } else {
                $queryBuilder->andWhere("{$finder->getAlias()}.uuid IN (:{$finder->getAlias()})");
            }

            $queryBuilder->setParameter($finder->getAlias(), $finder->getFilterValue());
        }
    }
}
