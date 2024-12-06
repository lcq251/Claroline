<?php

namespace Claroline\ForumBundle\Controller;

use Claroline\AppBundle\Annotations\ApiDoc;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\ForumBundle\Entity\Forum;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Subject;
use Claroline\ForumBundle\Manager\ForumManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/forum', name: 'apiv2_forum_')]
class ForumController extends AbstractCrudController
{
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly ForumManager $manager
    ) {
        $this->authorization = $authorization;
    }

    public static function getClass(): string
    {
        return Forum::class;
    }

    public static function getName(): string
    {
        return 'forum';
    }

    /**
     * @ApiDoc(
     *     description="Get the subjects of a forum",
     *     queryString={
     *         "$finder=Claroline\ForumBundle\Entity\Subject&!forum",
     *         {"name": "page", "type": "integer", "description": "The queried page."},
     *         {"name": "limit", "type": "integer", "description": "The max amount of objects per page."},
     *         {"name": "sortBy", "type": "string", "description": "Sort by the property if you want to."}
     *     },
     *     parameters={
     *          {"name": "id", "type": {"string", "integer"},  "description": "The forum id or uuid"}
     *     }
     * )
     */
    #[Route(path: '/{id}/subjects', name: 'list_subjects', methods: ['GET'])]
    public function listSubjectsAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Forum $forum,
        Request $request
    ): JsonResponse {
        $this->checkPermission('OPEN', $forum->getResourceNode(), [], true);

        return new JsonResponse(
            $this->crud->list(Subject::class, array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['forum' => [$forum->getUuid()], 'moderation' => false]]
            ))
        );
    }

    /**
     * @ApiDoc(
     *     description="Create a subject in a forum",
     *     parameters={
     *          {"name": "id", "type": {"string", "integer"},  "description": "The forum id or uuid"}
     *     }
     * )
     */
    #[Route(path: '/{id}/subject', name: 'create_subject', methods: ['POST', 'PUT'])]
    public function createSubjectAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Forum $forum,
        Request $request
    ): JsonResponse {
        $subject = new Subject();
        $subject->setForum($forum);

        $options = static::getOptions();
        $this->crud->create($subject, $this->decodeRequest($request), $options['create'] ?? []);

        return new JsonResponse(
            $this->serializer->serialize($subject, $options['get'] ?? []),
            201
        );
    }

    #[Route(path: '/notify/{user}/forum/{forum}', name: 'notify', methods: ['PATCH'])]
    public function notifyAction(
        #[MapEntity(mapping: ['user' => 'uuid'])]
        User $user,
        #[MapEntity(mapping: ['forum' => 'uuid'])]
        Forum $forum
    ): JsonResponse {
        $this->checkPermission('OPEN', $forum->getResourceNode(), [], true);

        $validationUser = $this->manager->getValidationUser($user, $forum);
        $validationUser->setNotified(true);
        $this->om->persist($validationUser);
        $this->om->flush();

        return new JsonResponse(true);
    }

    #[Route(path: '/unnotify/{user}/forum/{forum}', name: 'unnotifiy', methods: ['PATCH'])]
    public function unnotifyAction(
        #[MapEntity(mapping: ['user' => 'uuid'])]
        User $user,
        #[MapEntity(mapping: ['forum' => 'uuid'])]
        Forum $forum
    ): JsonResponse {
        $this->checkPermission('OPEN', $forum->getResourceNode(), [], true);

        $validationUser = $this->manager->getValidationUser($user, $forum);
        $validationUser->setNotified(false);
        $this->om->persist($validationUser);
        $this->om->flush();

        return new JsonResponse(true);
    }
}
