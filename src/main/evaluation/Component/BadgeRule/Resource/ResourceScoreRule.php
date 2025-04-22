<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule\Resource;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Component\BadgeRule\AbstractScoreRule;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Event\EvaluationEvents;
use Claroline\EvaluationBundle\Event\ResourceEvaluationEvent;
use Claroline\OpenBadgeBundle\Entity\Rule;
use Symfony\Contracts\Translation\TranslatorInterface;

class ResourceScoreRule extends AbstractScoreRule
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'resource_score';
    }

    public function supportsContext(string $context): bool
    {
        return true;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            EvaluationEvents::RESOURCE_EVALUATION => 'onEvaluation',
        ];
    }

    public function onEvaluation(ResourceEvaluationEvent $event): void
    {
        $evaluation = $event->getEvaluation();

        /** @var Rule[] $rules */
        $rules = $this->om->getRepository(Rule::class)->findBy([
            'action' => static::getName(),
            'subjectId' => $evaluation->getResourceNode()->getUuid(),
        ]);

        foreach ($rules as $rule) {
            $this->grantEvaluation($rule, $evaluation);
        }
    }

    public function getQualifiedUsers(Rule $rule, ?object $subject = null): iterable
    {
        if (empty($subject)) {
            return [];
        }

        $evaluations = $this->om->getRepository(ResourceEvaluation::class)->findBy([
            'resourceNode' => $subject,
        ]);

        return $this->checkEvaluations($rule, $evaluations);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_resource_score_above', [
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }
}
