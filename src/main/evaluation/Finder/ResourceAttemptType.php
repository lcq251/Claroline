<?php

namespace Claroline\EvaluationBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\RelatedEntityType;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceAttempt;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ResourceAttemptType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ResourceAttempt::class,
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('resourceNode', RelatedEntityType::class)
            ->add('workspace', RelatedEntityType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EvaluationType::class;
    }
}
