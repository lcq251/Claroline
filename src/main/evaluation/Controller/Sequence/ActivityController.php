<?php

namespace Claroline\EvaluationBundle\Controller\Sequence;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\LogBundle\Entity\FunctionalLog;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/sequence/{id}')]
class ActivityController
{
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly Crud $crud
    ) {
        $this->authorization = $authorization;
    }

    #[Route(path: '/logs', name: 'apiv2_sequence_functional_logs', methods: ['GET'])]
    public function functionalLogsAction(
        #[MapEntity(mapping: ['id' => 'uuid'])]
        Sequence $sequence,
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery()
    ): StreamedJsonResponse {
        $this->checkPermission('EDIT', $sequence, [], true);

        $finderQuery->addFilter('objectClass', Sequence::class);
        $finderQuery->addFilter('objectId', $sequence->getUuid());

        $logs = $this->crud->search(FunctionalLog::class, $finderQuery, [SerializerInterface::SERIALIZE_LIST]);

        return $logs->toResponse();
    }
}
