<?php

namespace Claroline\LogBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Claroline\AppBundle\API\Finder\Type\ClosureType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\LogBundle\Entity\OperationalLog;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

class OperationalLogType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => OperationalLog::class,
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('contextName', TextType::class, ['mode' => TextType::MODE_EXACT])
            ->add('contextId', TextType::class, ['mode' => TextType::MODE_EXACT])
            ->add('objectId', ClosureType::class, [
                'buildQuery' => function (QueryBuilder $queryBuilder, FinderInterface $finder): void {
                    if (null !== $finder->getFilterValue()) {
                        $alias = $finder->getAlias();
                        if (!$finder->isRoot()) {
                            $alias = $finder->getParent()->getAlias();
                        }

                        $queryBuilder->andWhere("($alias.parentId = :objectOrParent OR $alias.objectId = :objectOrParent)");
                        $queryBuilder->setParameter('objectOrParent', $finder->getFilterValue());
                    }
                },
            ])
            ->add('objectClass', TextType::class, ['mode' => TextType::MODE_EXACT])
        ;
    }

    public function getParent(): ?string
    {
        return LogType::class;
    }
}
