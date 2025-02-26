<?php

namespace Claroline\EvaluationBundle\Component\Tool;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Component\Context\ContextSubjectInterface;
use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\EvaluationBundle\Entity\Sequence\Assignment;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\UserEvaluation\ResourceEvaluation;
use Claroline\EvaluationBundle\Entity\UserEvaluation\WorkspaceEvaluation;
use Claroline\EvaluationBundle\Library\EvaluationOptions;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ProgressionTool extends ToolComponent
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly ObjectManager $om,
        private readonly FinderProvider $finder,
        private readonly SerializerProvider $serializer,
        private readonly Crud $crud
    ) {
    }

    public static function getName(): string
    {
        return 'progression';
    }

    public function supportsContext(string $context): bool
    {
        return in_array($context, [
            DesktopContext::getName(),
            WorkspaceContext::getName(),
        ]);
    }

    public static function getIcon(): string
    {
        return 'route';
    }

    public function getStatus(string $context, ?ContextSubjectInterface $contextSubject = null): ?string
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof User) {
            return null;
        }

        $workspaceEvaluation = $this->getUserEvaluation($contextSubject);
        $progression = $workspaceEvaluation->getProgression();
        if ($progression) {
            $progression = round($progression, EvaluationOptions::PROGRESSION_PRECISION);
        }

        return $progression.'%';
    }

    public function open(OrderedTool $tool, string $context, ContextSubjectInterface $contextSubject = null): ?array
    {
        $workspaceEvaluation = null;

        $user = $this->tokenStorage->getToken()?->getUser();
        if ($user instanceof User) {
            $workspaceEvaluation = $this->getUserEvaluation($contextSubject);
            $assignments = $this->om->getRepository(Assignment::class)->findByWorkspaceAndUser($contextSubject, $user);

            $sequences = array_map(function (Assignment $assignment) {
                return $assignment->getSequence();
            }, $assignments);
        } else {
            $sequences = $this->om->getRepository(Sequence::class)->findBy([
                'published' => true,
                'public' => true,
                'workspace' => $contextSubject,
            ]);
        }

        return [
            'sequences' => array_map(function (Sequence $sequence) {
                return $this->serializer->serialize($sequence, [SerializerInterface::SERIALIZE_MINIMAL]);
            }, $sequences),
            'workspaceEvaluation' => $workspaceEvaluation ? $this->serializer->serialize($workspaceEvaluation) : null,
            'resourceEvaluations' => $this->finder->search(ResourceEvaluation::class, [
                'filters' => ['workspace' => $contextSubject->getContextIdentifier(), 'user' => $user->getUuid()],
            ])['data'],
        ];
    }

    public function configure(OrderedTool $tool, string $context, ContextSubjectInterface $contextSubject = null, array $configData = []): ?array
    {
        if (!empty($configData['evaluation'])) {
            $this->crud->update($contextSubject, ['evaluation' => $configData['evaluation']], [Crud::NO_PERMISSIONS]);

            return [
                'evaluation' => $configData['evaluation'],
            ];
        }

        return [];
    }

    private function getUserEvaluation(Workspace $workspace): ?WorkspaceEvaluation
    {
        $workspaceEvaluation = $this->om->getRepository(WorkspaceEvaluation::class)->findOneBy([
            'workspace' => $workspace,
            'user' => $this->tokenStorage->getToken()?->getUser(),
        ]);

        if (empty($workspaceEvaluation)) {
            $workspaceEvaluation = new WorkspaceEvaluation();
        }

        return $workspaceEvaluation;
    }
}
