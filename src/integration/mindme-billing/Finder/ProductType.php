<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\BillingBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\NumericType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Mindme\BillingBundle\Entity\Product;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Finder type for the unified Product entity.
 *
 * Exposes filters/sorts for: code, description, targetType, status, price.
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
            ->add('targetId', NumericType::class)
            ->add('status', TextType::class, ['mode' => TextType::MODE_EXACT])
            ->add('price', NumericType::class)
        ;
    }

    public function getParent(): ?string
    {
        return \Claroline\AppBundle\API\Finder\Type\EntityType::class;
    }
}