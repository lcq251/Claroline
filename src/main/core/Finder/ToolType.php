<?php

namespace Claroline\CoreBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Claroline\AppBundle\API\Finder\Type\ClosureType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\HiddenType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ToolType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => OrderedTool::class,
            'fulltext' => [],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class)
            ->add('context', TextType::class)
            ->add('contextId', TextType::class)
            ->add('hidden', HiddenType::class)
            ->add('roles', ClosureType::class, [
                'buildQuery' => static function (QueryBuilder $queryBuilder, FinderInterface $finder): void {
                    if (null === $finder->getFilterValue()) {
                        return;
                    }

                    $alias = $finder->getAlias();
                    if (!$finder->isRoot()) {
                        $alias = $finder->getParent()->getAlias();
                    }

                    $queryBuilder->join($alias.'.rights', 'r');
                    $queryBuilder->join('r.role', 'rr');
                    $queryBuilder->andWhere('BIT_AND(r.mask, 1) = 1');
                    $queryBuilder->andWhere('rr.name IN (:toolRoles)');
                    $queryBuilder->setParameter('toolRoles', is_array($finder->getFilterValue()) ? $finder->getFilterValue() : [$finder->getFilterValue()]);
                },
            ])
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
