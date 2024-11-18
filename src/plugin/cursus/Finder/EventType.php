<?php

namespace Claroline\CursusBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Claroline\AppBundle\API\Finder\Type\DateType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\CommunityBundle\Entity\Team;
use Claroline\CoreBundle\Finder\WorkspaceType;
use Claroline\CursusBundle\Entity\Event;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Event::class,
            'fulltext' => ['name', 'code', 'description'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class)
            ->add('code', TextType::class)
            ->add('description', TextType::class)
            //->add('startDate', DateType::class)
            //->add('endDate', DateType::class)
            //->add('session', SessionType::class)
            ->add('workspace', WorkspaceType::class, [
                'joinQuery' => static function (QueryBuilder $queryBuilder, FinderInterface $finder): void {
                    $alias = $finder->getAlias();
                    if (!$finder->isRoot()) {
                        $alias = $finder->getParent()->getAlias();
                    }

                    $queryBuilder->leftJoin($alias.'.session', 'sessionWorkspace');
                    $queryBuilder->leftJoin('sessionWorkspace.workspace', $finder->getAlias());
                },
            ])
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
