<?php

namespace Claroline\EvaluationBundle\Component\Tool;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Component\Context\ContextSubjectInterface;
use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Evaluation;
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
        return '75%';
    }

    public function open(OrderedTool $tool, string $context, ContextSubjectInterface $contextSubject = null): ?array
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof User) {
            return [];
        }

        $workspaceEvaluation = $this->om->getRepository(Evaluation::class)->findOneBy([
            'workspace' => $contextSubject,
            'user' => $this->tokenStorage->getToken()?->getUser(),
        ]);

        if (empty($workspaceEvaluation)) {
            $workspaceEvaluation = new Evaluation();
        }

        return [
            'workspaceEvaluation' => $this->serializer->serialize($workspaceEvaluation),
            'resourceEvaluations' => $this->finder->search(ResourceUserEvaluation::class, [
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
}
