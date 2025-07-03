<?php

namespace Claroline\TagBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Claroline\AppBundle\API\Finder\Type\ClosureType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\AppBundle\API\Finder\Type\UuidType;
use Claroline\TagBundle\Entity\Tag;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

final class TagType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tag::class,
            'fulltext' => ['name', 'description'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('id', UuidType::class)
            ->add('name', TextType::class)
            ->add('description', TextType::class)
            ->add('usedBy', ClosureType::class, [
                'buildQuery' => function (QueryBuilder $queryBuilder, FinderInterface $finder): void {
                    if (null !== $finder->getFilterValue()) {
                        $alias = $finder->getAlias();
                        if (!$finder->isRoot()) {
                            $alias = $finder->getParent()->getAlias();
                        }

                        $queryBuilder->join($alias.'.taggedObjects', 'to');
                        $queryBuilder->andWhere('to.objectClass = :usedByClass');
                        $queryBuilder->setParameter('usedByClass', $finder->getFilterValue());
                    }
                },
            ])
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
