<?php

namespace Claroline\EvaluationBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AuthenticationBundle\Messenger\Stamp\AuthenticationStamp;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\Sequence\Step;
use Claroline\EvaluationBundle\Entity\SequenceEvaluation;
use Claroline\EvaluationBundle\Event\EvaluationEvents;
use Claroline\EvaluationBundle\Event\SequenceEvaluationEvent;
use Claroline\EvaluationBundle\Library\Checker\ProgressionChecker;
use Claroline\EvaluationBundle\Library\Checker\ScoreChecker;
use Claroline\EvaluationBundle\Library\EvaluationAggregator;
use Claroline\EvaluationBundle\Library\GenericEvaluation;
use Claroline\EvaluationBundle\Messenger\Message\RecomputeSequenceEvaluations;
use Claroline\EvaluationBundle\Repository\SequenceRepository;
use Doctrine\Persistence\ObjectRepository;
use Innova\PathBundle\Entity\UserProgression;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SequenceEvaluationManager extends AbstractEvaluationManager
{
    private ObjectRepository $progressionRepo;
    private SequenceRepository $sequenceRepo;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly MessageBusInterface $messageBus,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly ObjectManager $om,
        private readonly ResourceEvaluationManager $resourceEvalManager
    ) {
        $this->progressionRepo = $this->om->getRepository(UserProgression::class);
        $this->sequenceRepo = $this->om->getRepository(Sequence::class);
    }

    public function getByResource(ResourceNode $resourceNode): array
    {
        return $this->om->getRepository(Sequence::class)->findByRequiredResource($resourceNode);
    }

    /**
     * Retrieve or create evaluation for a sequence and a user.
     */
    public function getUserEvaluation(Sequence $sequence, User $user, ?bool $withCreation = true): SequenceEvaluation
    {
        $evaluation = $this->om->getRepository(SequenceEvaluation::class)->findOneBy([
            'sequence' => $sequence,
            'user' => $user,
        ]);

        if ($withCreation && empty($evaluation)) {
            $evaluation = new SequenceEvaluation();
            $evaluation->setSequence($sequence);
            $evaluation->setUser($user);

            $this->om->persist($evaluation);
            $this->om->flush();
        }

        return $evaluation;
    }

    public function getRequiredEvaluations(Sequence $sequence, User $user): array
    {
        return $this->sequenceRepo->findRequiredEvaluations($sequence, $user);
    }

    /**
     * Get all steps progression for a user.
     */
    public function getStepsProgressionForUser(Sequence $sequence, User $user): array
    {
        $stepsProgression = [];

        foreach ($sequence->getSteps() as $step) {
            $userProgression = $this->progressionRepo->findOneBy(['step' => $step, 'user' => $user]);

            if ($userProgression) {
                $stepsProgression[$step->getUuid()] = $userProgression->getStatus();
            }
        }

        return $stepsProgression;
    }

    public function update(Step $step, User $user, string $status): UserProgression
    {
        // Retrieve the current progression for this step
        $progression = $this->progressionRepo->findOneBy([
            'step' => $step,
            'user' => $user,
        ]);

        if (empty($progression)) {
            // No progression for User => initialize a new one
            $progression = new UserProgression();
            $progression->setStep($step);
            $progression->setUser($user);
        }

        if ('seen' !== $status || 'unseen' === $progression->getStatus()) {
            $progression->setStatus($status);
        }

        $this->om->persist($progression);
        $this->om->flush();

        // recompute sequence progression for user
        $this->computeEvaluation($step->getSequence(), $user);

        return $progression;
    }

    public function computeEvaluation(Sequence $sequence, User $user): SequenceEvaluation
    {
        $evaluation = $this->getUserEvaluation($sequence, $user);
        $this->refreshEvaluation($evaluation);

        return $evaluation;
    }

    public function refreshEvaluation(SequenceEvaluation $evaluation): void
    {
        $sequence = $evaluation->getSequence();
        $user = $evaluation->getUser();

        // load the user progression for the sequence (aka the seen/done/etc. flags on steps)
        $stepsProgression = $this->getStepsProgressionForUser($sequence, $user);

        // the sequence evaluation aggregates the progression/score of all its required/evaluated resources
        // and the status of the steps which don't contain any resource.
        $aggregator = new EvaluationAggregator([
            new ProgressionChecker(),
            new ScoreChecker($sequence->getSuccessScore()),
        ]);

        if (!empty($sequence->getOverviewResource()) && $sequence->getOverviewResource()->isRequired()) {
            // the sequence contains a required resource on its overview, we need to get the evaluation for this resource
            // in order to compute the step progression
            $resourceEvaluation = $this->resourceEvalManager->getUserEvaluation($sequence->getOverviewResource(), $user, false);
            if (!$resourceEvaluation) {
                // no evaluation, adds an empty evaluation for correct progression check
                $resourceEvaluation = new GenericEvaluation(0);
            }

            $aggregator->addEvaluation($resourceEvaluation, $sequence->getOverviewResource()->isEvaluated());
        }

        foreach ($sequence->getSteps() as $step) {
            if (!empty($step->getResource()) && $step->getResource()->isRequired()) {
                // the step contains a required resource, we need to get the evaluation for this resource
                // in order to compute the step progression
                $resourceEvaluation = $this->resourceEvalManager->getUserEvaluation($step->getResource(), $user, false);
                if (!$resourceEvaluation) {
                    // no evaluation, adds an empty evaluation for correct progression check
                    $resourceEvaluation = new GenericEvaluation(0);
                }

                $aggregator->addEvaluation($resourceEvaluation, $step->getResource()->isEvaluated());
            } else {
                // no required resource in the step, we only check if the step is seen/done
                $stepDone = !empty($stepsProgression[$step->getUuid()]) && in_array($stepsProgression[$step->getUuid()], ['seen', 'done']);
                $aggregator->addEvaluation(new GenericEvaluation($stepDone ? 100 : 0));
            }
        }

        // update evaluation data
        $hasChanged = $this->updateEvaluation($evaluation, [
            'status' => $aggregator->getStatus(),
            'score' => $aggregator->getScore(),
            'scoreMax' => $aggregator->getScoreMax(),
            'progression' => $aggregator->getProgression(),
        ]);

        $this->om->persist($evaluation);
        $this->om->flush();

        if ($hasChanged['status'] || $hasChanged['progression'] || $hasChanged['score']) {
            $this->eventDispatcher->dispatch(new SequenceEvaluationEvent($evaluation, $hasChanged), EvaluationEvents::WORKSPACE_EVALUATION);
        }
    }

    /**
     * Recomputes all the evaluations of a sequence.
     * This is called when required resources are added/removed in order to update the users progression and score.
     */
    public function recomputeEvaluations(Sequence $sequence): void
    {
        $this->messageBus->dispatch(
            new RecomputeSequenceEvaluations($sequence->getId()),
            [new AuthenticationStamp($this->tokenStorage->getToken()?->getUser()->getId())]
        );
    }
}
