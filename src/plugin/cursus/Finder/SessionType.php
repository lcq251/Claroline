<?php

namespace Claroline\CursusBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\BooleanType;
use Claroline\AppBundle\API\Finder\Type\DateType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\HiddenType;
use Claroline\AppBundle\API\Finder\Type\NumericType;
use Claroline\AppBundle\API\Finder\Type\PeriodStatusType;
use Claroline\AppBundle\API\Finder\Type\RelatedEntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Finder\LocationType;
use Claroline\CoreBundle\Finder\WorkspaceType;
use Claroline\CursusBundle\Entity\Session;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SessionType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Session::class,
            'fulltext' => ['code'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('code', TextType::class)
            ->add('hidden', HiddenType::class)
            ->add('startDate', DateType::class)
            ->add('endDate', DateType::class)
            ->add('status', PeriodStatusType::class)
            ->add('price', NumericType::class)
            ->add('canceled', BooleanType::class, ['default' => false])
            ->add('course', CourseType::class)
            ->add('workspace', RelatedEntityType::class)
            ->add('location', RelatedEntityType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
