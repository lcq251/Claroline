<?php

namespace Claroline\CursusBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\BooleanType;
use Claroline\AppBundle\API\Finder\Type\DateType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\NumericType;
use Claroline\AppBundle\API\Finder\Type\PeriodStatusType;
use Claroline\AppBundle\API\Finder\Type\TextType;
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
            'fulltext' => ['name', 'code', 'description'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class)
            ->add('code', TextType::class)
            ->add('description', TextType::class)
            ->add('startDate', DateType::class)
            ->add('endDate', DateType::class)
            ->add('status', PeriodStatusType::class)
            ->add('price', NumericType::class)
            ->add('canceled', BooleanType::class, ['default' => false])
            ->add('course', CourseType::class)
            ->add('workspace', WorkspaceType::class)
            ->add('location', LocationType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
