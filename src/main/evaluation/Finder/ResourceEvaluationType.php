<?php

namespace Claroline\EvaluationBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\NumericType;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\CoreBundle\Finder\ResourceNodeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ResourceEvaluationType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ResourceEvaluation::class,
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nbAttempts', NumericType::class)
            ->add('resourceNode', ResourceNodeType::class)
        ;
    }

    public function getParent(): ?string
    {
        return EvaluationType::class;
    }
}
