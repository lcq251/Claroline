<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule\Workspace;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Component\BadgeRule\AbstractScoreRule;
use Claroline\EvaluationBundle\Entity\UserEvaluation\WorkspaceEvaluation;
use Claroline\EvaluationBundle\Event\EvaluationEvents;
use Claroline\EvaluationBundle\Event\WorkspaceEvaluationEvent;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use Symfony\Contracts\Translation\TranslatorInterface;

class WorkspaceScoreRule extends AbstractScoreRule
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'workspace_score_above';
    }

    public static function getSubscribedEvents(): array
    {
        return [
            EvaluationEvents::WORKSPACE_EVALUATION => 'onWorkspaceEvaluation',
        ];
    }

    public function onWorkspaceEvaluation(WorkspaceEvaluationEvent $event): void
    {
        $evaluation = $event->getEvaluation();

        /** @var Rule[] $rules */
        $rules = $this->om->getRepository(Rule::class)->findBy([
            'action' => static::getName(),
            'workspace' => $evaluation->getWorkspace(),
        ]);

        foreach ($rules as $rule) {
            $this->grantEvaluation($rule, $evaluation);
        }
    }

    public function getQualifiedUsers(Rule $rule): iterable
    {
        $evaluations = $this->om->getRepository(WorkspaceEvaluation::class)->findBy([
            'workspace' => $rule->getWorkspace(),
        ]);

        return $this->checkEvaluations($rule, $evaluations);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_workspace_score_above', [
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }
}
