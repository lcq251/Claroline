<?php

namespace Claroline\AuthenticationBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\AuthenticationBundle\Entity\ApiToken;
use Claroline\CommunityBundle\Finder\UserType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ApiTokenType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ApiToken::class,
            'fulltext' => ['description'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('description', TextType::class)
            ->add('user', UserType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
