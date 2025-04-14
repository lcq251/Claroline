<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule\Resource;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Component\BadgeRule\AbstractProgressionRule;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Event\EvaluationEvents;
use Claroline\EvaluationBundle\Event\ResourceEvaluationEvent;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use Symfony\Contracts\Translation\TranslatorInterface;

class ResourceProgressionRule extends AbstractProgressionRule
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'resource_completed_above';
    }

    public static function getSubscribedEvents(): array
    {
        return [
            EvaluationEvents::RESOURCE_EVALUATION => 'onResourceEvaluation',
        ];
    }

    public function onResourceEvaluation(ResourceEvaluationEvent $event): void
    {
        $evaluation = $event->getEvaluation();

        /** @var Rule[] $rules */
        $rules = $this->om->getRepository(Rule::class)->findBy([
            'action' => static::getName(),
            'node' => $evaluation->getResourceNode(),
        ]);

        foreach ($rules as $rule) {
            $this->grantEvaluation($rule, $evaluation);
        }
    }

    public function getQualifiedUsers(Rule $rule): iterable
    {
        $evaluations = $this->om->getRepository(ResourceEvaluation::class)->findBy([
            'resourceNode' => $rule->getResourceNode(),
        ]);

        return $this->checkEvaluations($rule, $evaluations);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_resource_completed_above', [
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }
}
