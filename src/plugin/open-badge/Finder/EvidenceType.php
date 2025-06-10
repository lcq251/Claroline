<?php

namespace Claroline\OpenBadgeBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\CommunityBundle\Finder\UserType;
use Claroline\OpenBadgeBundle\Entity\Evidence;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EvidenceType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Evidence::class,
            'fulltext' => [],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user', UserType::class)
            ->add('assertion', AssertionType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
