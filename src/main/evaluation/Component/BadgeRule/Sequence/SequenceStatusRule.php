<?php

namespace Claroline\EvaluationBundle\Component\BadgeRule\Sequence;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\EvaluationBundle\Component\BadgeRule\AbstractStatusRule;
use Claroline\EvaluationBundle\Entity\UserEvaluation\SequenceEvaluation;
use Claroline\EvaluationBundle\Event\EvaluationEvents;
use Claroline\EvaluationBundle\Event\SequenceEvaluationEvent;
use Claroline\OpenBadgeBundle\Entity\Rule;
use Symfony\Contracts\Translation\TranslatorInterface;

class SequenceStatusRule extends AbstractStatusRule
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'sequence_status';
    }

    public function supportsContext(string $context): bool
    {
        return true;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            EvaluationEvents::SEQUENCE_EVALUATION => 'onEvaluation',
        ];
    }

    public function onEvaluation(SequenceEvaluationEvent $event): void
    {
        $evaluation = $event->getEvaluation();

        /** @var Rule[] $rules */
        $rules = $this->om->getRepository(Rule::class)->findBy([
            'action' => static::getName(),
            'subjectId' => $evaluation->getSequence()->getUuid(),
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

        $evaluations = $this->om->getRepository(SequenceEvaluation::class)->findBy([
            'sequence' => $subject,
        ]);

        return $this->checkEvaluations($rule, $evaluations);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_sequence_status', [
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }
}
