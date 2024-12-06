<?php

namespace Claroline\ForumBundle\Controller;

use Claroline\AppBundle\Annotations\ApiDoc;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\ForumBundle\Entity\Forum;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Subject;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/forum_subject', name: 'apiv2_forum_subject_')]
class SubjectController extends AbstractCrudController
{
    use PermissionCheckerTrait;

    public function __construct(AuthorizationCheckerInterface $authorization)
    {
        $this->authorization = $authorization;
    }

    public static function getName(): string
    {
        return 'forum_subject';
    }

    public static function getClass(): string
    {
        return Subject::class;
    }

    public function getIgnore(): array
    {
        return ['list', 'create'];
    }

    /**
     * @ApiDoc(
     *     description="Get the messages of a subject",
     *     queryString={
     *         "$finder=Claroline\ForumBundle\Entity\Message&!parent&!subject",
     *         {"name": "page", "type": "integer", "description": "The queried page."},
     *         {"name": "limit", "type": "integer", "description": "The max amount of objects per page."},
     *         {"name": "sortBy", "type": "string", "description": "Sort by the property if you want to."}
     *     },
     *     parameters={
     *          {"name": "id", "type": {"string", "integer"},  "description": "The subject id or uuid"}
     *     }
     * )
     */
    #[Route(path: '/{id}/messages', name: 'get_messages', methods: ['GET'])]
    public function listMessagesAction(
        Request $request,
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Subject $subject
    ): JsonResponse {
        $this->checkPermission('OPEN', $subject, [], true);

        return new JsonResponse(
            $this->crud->list(Message::class, array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['subject' => $subject->getUuid(), 'parent' => null, 'first' => false]]
            ))
        );
    }

    /**
     * @ApiDoc(
     *     description="Create a message in a subject",
     *     parameters={
     *          {"name": "id", "type": {"string", "integer"},  "description": "The subject id or uuid"}
     *     }
     * )
     */
    #[Route(path: '/{id}/message', name: 'create_message', methods: ['POST', 'PUT'])]
    public function createMessage(#[MapEntity(class: 'Claroline\ForumBundle\Entity\Subject', mapping: ['id' => 'uuid'])]
        Subject $subject, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $subject, [], true);

        $options = static::getOptions();

        $message = new Message();
        $message->setSubject($subject);

        $this->crud->create($message, $this->decodeRequest($request), $options['create'] ?? []);

        return new JsonResponse(
            $this->serializer->serialize($message, $options['get'] ?? []),
            201
        );
    }

    /**
     * @ApiDoc(
     *     description="Udate a message in a subject",
     *     parameters={
     *          {"name": "id", "type": {"string", "integer"},  "description": "The subject id or uuid"}
     *     }
     * )
     */
    #[Route(path: '/{subject}/message/{message}', name: 'message_update', methods: ['PUT'])]
    public function updateMessageAction(
        #[MapEntity(mapping: ['subject' => 'uuid'])]
        Subject $subject,
        #[MapEntity(mapping: ['message' => 'uuid'])]
        Message $message,
        Request $request
    ): JsonResponse {
        $this->checkPermission('OPEN', $subject, [], true);

        return parent::updateAction($message->getUuid(), $request);
    }

    #[Route(path: '/forum/{forum}/subjects/list/flagged', name: 'flagged_list', methods: ['GET'])]
    public function listFlaggedSubjectsAction(#[MapEntity(class: 'Claroline\ForumBundle\Entity\Forum', mapping: ['forum' => 'uuid'])]
        Forum $forum, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $forum->getResourceNode(), [], true);

        return new JsonResponse(
            $this->crud->list(self::getClass(), array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['flagged' => true, 'forum' => $forum->getUuid()]]
            ))
        );
    }
}
