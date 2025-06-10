<?php

namespace Claroline\CommunityBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Claroline\AppBundle\API\Finder\Type\ClosureType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\RelatedEntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Role;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

class GroupType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Group::class,
            'fulltext' => ['name', 'code', 'description'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class)
            ->add('code', TextType::class)
            ->add('description', TextType::class)
            ->add('organization', OrganizationType::class)
            ->add('user', RelatedEntityType::class, [
                'joinQuery' => static function (QueryBuilder $queryBuilder, FinderInterface $finder): void {
                    $alias = $finder->getAlias();
                    if (!$finder->isRoot()) {
                        $alias = $finder->getParent()->getAlias();
                    }

                    $queryBuilder->leftJoin(Group::class, $finder->getAlias(), Join::WITH, "$alias MEMBER OF {$finder->getAlias()}.groups");
                },
            ])
            ->add('workspace', ClosureType::class, [
                'buildQuery' => function (QueryBuilder $queryBuilder, FinderInterface $finder) {
                    if (null !== $finder->getFilterValue()) {
                        $alias = $finder->getAlias();
                        if (!$finder->isRoot()) {
                            $alias = $finder->getParent()->getAlias();
                        }

                        $queryBuilder->andWhere("EXISTS (
                            SELECT wsr.id
                            FROM Claroline\CoreBundle\Entity\Role AS wsr
                            LEFT JOIN Claroline\CoreBundle\Entity\Group AS wsrg WITH (wsr MEMBER OF wsrg.roles AND wsrg MEMBER OF $alias.groups)
                            WHERE wsr.workspace = :workspace
                              AND wsrg IS NOT NULL
                        )");
                        $queryBuilder->setParameter('workspace', $finder->getFilterValue());
                    }
                },
            ])
        ;
    }

    public function buildQuery(QueryBuilder $queryBuilder, FinderInterface $finder, array $options): void
    {
        if ($finder->getSortValue()) {
            $queryBuilder->addOrderBy("{$finder->getQueryPath()}.name", $finder->getSortValue());
        }
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
