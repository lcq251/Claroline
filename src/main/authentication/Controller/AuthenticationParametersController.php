<?php

namespace Claroline\AuthenticationBundle\Controller;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\AbstractSecurityController;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\AuthenticationBundle\Manager\AuthenticationManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class AuthenticationParametersController extends AbstractSecurityController
{
    use RequestDecoderTrait;

    public function __construct(
        private readonly Crud $crud,
        private readonly AuthenticationManager $authenticationManager,
        private readonly SerializerProvider $serializer,
        AuthorizationCheckerInterface $authorization
    ) {
        $this->setAuthorizationChecker($authorization);
    }

    #[Route(path: '/authentication', name: 'apiv2_authentication_parameters_update', methods: ['PUT'])]
    public function updateAction(Request $request): JsonResponse
    {
        $this->canOpenAdminTool('authentication');

        $data = $this->decodeRequest($request);
        $authenticationParameters = $this->authenticationManager->getParameters();
        $authenticationParametersUpdate = $this->crud->update($authenticationParameters, $data);

        return new JsonResponse(
            $this->serializer->serialize($authenticationParametersUpdate)
        );
    }
}
