<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule\Workspace;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Component\BadgeRule\AbstractProgressionRule;
use Claroline\EvaluationBundle\Entity\UserEvaluation\WorkspaceEvaluation;
use Claroline\EvaluationBundle\Event\EvaluationEvents;
use Claroline\EvaluationBundle\Event\WorkspaceEvaluationEvent;
use Claroline\OpenBadgeBundle\Entity\Rule;
use Symfony\Contracts\Translation\TranslatorInterface;

class WorkspaceProgressionRule extends AbstractProgressionRule
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'workspace_progression';
    }

    public function supportsContext(string $context): bool
    {
        return true;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            EvaluationEvents::WORKSPACE_EVALUATION => 'onEvaluation',
        ];
    }

    public function onEvaluation(WorkspaceEvaluationEvent $event): void
    {
        $evaluation = $event->getEvaluation();

        /** @var Rule[] $rules */
        $rules = $this->om->getRepository(Rule::class)->findBy([
            'action' => static::getName(),
            'subjectId' => $evaluation->getWorkspace()->getUuid(),
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

        $evaluations = $this->om->getRepository(WorkspaceEvaluation::class)->findBy([
            'workspace' => $subject,
        ]);

        return $this->checkEvaluations($rule, $evaluations);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_workspace_completed_above', [
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }
}
