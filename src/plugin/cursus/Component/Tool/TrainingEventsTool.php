<?php

namespace Claroline\CursusBundle\Component\Tool;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Component\Context\ContextSubjectInterface;
use Claroline\AppBundle\Component\Tool\ToolComponent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CursusBundle\Entity\Course;

class TrainingEventsTool extends ToolComponent
{
    public function __construct(
        private readonly FinderProvider $finder,
        private readonly SerializerProvider $serializer,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'training_events';
    }

    public static function getIcon(): string
    {
        return 'graduation-cap';
    }

    public function supportsContext(string $context): bool
    {
        return WorkspaceContext::getName() === $context;
    }

    public function open(OrderedTool $tool, string $context, ContextSubjectInterface $contextSubject = null): ?array
    {
        $courses = $this->om->getRepository(Course::class)->findByWorkspace($contextSubject);

        if (count($courses) <= 0) {
            return null;
        }

        /*$sessionList = $this->finder->search(Session::class, [
            'filters' => ['workspace' => $contextSubject->getContextIdentifier()],
        ], [SerializerInterface::SERIALIZE_MINIMAL]);*/

        $course = $this->serializer->serialize($courses[0], [SerializerInterface::SERIALIZE_MINIMAL]);
        // $course['sessions'] = $sessionList['data'];

        return [
            'course' => $course,
        ];
    }
}
