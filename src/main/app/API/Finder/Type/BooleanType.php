<?php

namespace Claroline\AppBundle\API\Finder\Type;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BooleanType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'default' => null,
        ]);

        $resolver->setAllowedValues('default', [null, true, false]);
    }

    public function submit(mixed $filterValue, array $options): bool|string|null
    {
        if (null === $filterValue) {
            return $options['default'];
        }

        // filters[xxx]=any means "do not filter this boolean field" (include both values)
        if ('any' === $filterValue) {
            return 'any';
        }

        $requestValue = filter_var($filterValue, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

        return null === $requestValue ? $options['default'] : $requestValue;
    }

    public function buildQuery(QueryBuilder $queryBuilder, FinderInterface $finder, array $options): void
    {
        if ($finder->getSortValue()) {
            $queryBuilder->addOrderBy($finder->getQueryPath(), $finder->getSortValue());
        }

        // 'any' skips the filter: no where clause is generated for this boolean field
        if (null !== $finder->getFilterValue() && 'any' !== $finder->getFilterValue()) {
            $queryBuilder->andWhere("{$finder->getQueryPath()} = :{$finder->getAlias()}");
            $queryBuilder->setParameter($finder->getAlias(), $finder->getFilterValue());
        }
    }
}
