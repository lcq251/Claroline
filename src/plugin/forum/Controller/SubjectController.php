<?php

namespace Claroline\ForumBundle\Controller;

use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Subject;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
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

    #[Route(path: '/{id}/messages', name: 'get_messages', methods: ['GET'])]
    public function listMessagesAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Subject $subject,
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery()
    ): StreamedJsonResponse {
        $this->checkPermission('OPEN', $subject, [], true);

        $finderQuery->addFilter('subject', $subject->getUuid());
        $finderQuery->addFilter('parent', null);
        $finderQuery->addFilter('first', false);

        $subjects = $this->crud->search(Message::class, $finderQuery, [SerializerInterface::SERIALIZE_LIST]);

        return $subjects->toResponse();
    }

    #[Route(path: '/{id}/message', name: 'create_message', methods: ['POST', 'PUT'])]
    public function createMessage(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Subject $subject,
        Request $request
    ): JsonResponse {
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

    #[Route(path: '/{subject}/message/{message}', name: 'message_update', methods: ['PUT'])]
    public function updateMessageAction(
        #[MapEntity(mapping: ['message' => 'uuid'])]
        Message $message,
        Request $request
    ): JsonResponse {
        $this->checkPermission('EDIT', $message, [], true);

        $options = static::getOptions();
        $this->crud->update($message, $this->decodeRequest($request), $options['update'] ?? []);

        return new JsonResponse(
            $this->serializer->serialize($message)
        );
    }
}
