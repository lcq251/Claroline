<?php

namespace Claroline\CursusBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\ChoiceType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\CommunityBundle\Finder\UserType;
use Claroline\CursusBundle\Entity\EventPresence;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventPresenceType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => EventPresence::class,
            'fulltext' => [],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user', UserType::class)
            ->add('event', EventType::class)
            ->add('status', ChoiceType::class, [
                'choices' => [EventPresence::UNKNOWN, EventPresence::PRESENT, EventPresence::ABSENT_JUSTIFIED, EventPresence::ABSENT_UNJUSTIFIED],
            ])
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
