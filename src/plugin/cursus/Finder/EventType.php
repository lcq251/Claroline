<?php

namespace Claroline\CursusBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\DateType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\CoreBundle\Finder\WorkspaceType;
use Claroline\CursusBundle\Entity\Event;
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
            ->add('startDate', DateType::class)
            ->add('endDate', DateType::class)
            ->add('session', SessionType::class)
            ->add('workspace', WorkspaceType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
