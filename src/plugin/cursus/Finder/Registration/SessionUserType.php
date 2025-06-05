<?php

namespace Claroline\CursusBundle\Finder\Registration;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\BooleanType;
use Claroline\AppBundle\API\Finder\Type\ChoiceType;
use Claroline\AppBundle\API\Finder\Type\DateType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\CommunityBundle\Finder\UserType;
use Claroline\CursusBundle\Entity\Registration\AbstractRegistration;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Claroline\CursusBundle\Finder\SessionType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SessionUserType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SessionUser::class,
            'fulltext' => [],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user', UserType::class)
            ->add('session', SessionType::class)
            ->add('date', DateType::class)
            ->add('confirmed', BooleanType::class)
            ->add('validated', BooleanType::class)
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
