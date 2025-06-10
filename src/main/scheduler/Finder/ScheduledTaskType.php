<?php

namespace Claroline\SchedulerBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\Type\ChoiceType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\SchedulerBundle\Entity\ScheduledTask;
use Doctrine\DBAL\Types\DateTimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ScheduledTaskType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ScheduledTask::class,
            'fulltext' => ['name'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class)
            ->add('action', TextType::class)
            ->add('scheduledDate', DateTimeType::class)
            ->add('executionDate', DateTimeType::class)
            ->add('executionType', ChoiceType::class, [
                'choices' => [ScheduledTask::ONCE, ScheduledTask::RECURRING],
            ])
            ->add('status', ChoiceType::class, [
                'choices' => [ScheduledTask::PENDING, ScheduledTask::IN_PROGRESS, ScheduledTask::SUCCESS, ScheduledTask::ERROR],
            ])
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }
}
