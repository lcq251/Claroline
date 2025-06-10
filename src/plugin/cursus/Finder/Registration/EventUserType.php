<?php

namespace Claroline\CursusBundle\Finder\Registration;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\ChoiceType;
use Claroline\AppBundle\API\Finder\Type\DateType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\CommunityBundle\Finder\UserType;
use Claroline\CursusBundle\Entity\Registration\AbstractRegistration;
use Claroline\CursusBundle\Entity\Registration\EventUser;
use Claroline\CursusBundle\Finder\EventType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventUserType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => EventUser::class,
            'fulltext' => [],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user', UserType::class)
            ->add('event', EventType::class)
            ->add('date', DateType::class)
            ->add('type', ChoiceType::class, [
                'choices' => [AbstractRegistration::LEARNER, AbstractRegistration::TUTOR],
            ])
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
