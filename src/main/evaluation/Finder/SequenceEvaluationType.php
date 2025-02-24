<?php

namespace Claroline\EvaluationBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\RelatedEntityType;
use Claroline\EvaluationBundle\Entity\UserEvaluation\SequenceEvaluation;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SequenceEvaluationType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SequenceEvaluation::class,
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('sequence', RelatedEntityType::class)
            ->add('workspace', RelatedEntityType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EvaluationType::class;
    }
}
