<?php

namespace Claroline\MindMeAiBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\NumericType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\MindMeAiBundle\Entity\Product;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Finder type for the unified Product entity.
 *
 * Exposes filters/sorts for: code, description, targetType, status, price.
 * Parent EntityType provides the `data_class` + `fulltext` machinery.
 */
class ProductType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
            'fulltext' => ['code', 'description'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('code', TextType::class)
            ->add('description', TextType::class)
            ->add('targetType', TextType::class, ['mode' => TextType::MODE_EXACT])
            ->add('status', TextType::class, ['mode' => TextType::MODE_EXACT])
            ->add('price', NumericType::class)
        ;
    }

    public function getParent(): ?string
    {
        return \Claroline\AppBundle\API\Finder\Type\EntityType::class;
    }
}
