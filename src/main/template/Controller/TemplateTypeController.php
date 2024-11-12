<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TemplateBundle\Controller;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\TemplateBundle\Component\Template\TemplateProvider;
use Claroline\TemplateBundle\Entity\Template;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/template_type')]
class TemplateTypeController
{
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
        private readonly TemplateProvider $templateProvider
    ) {
        $this->authorization = $authorization;
    }

    #[Route(path: '/{type}', name: 'apiv2_template_type_get', methods: ['GET'])]
    public function getAction(string $type): JsonResponse
    {
        $this->checkPermission('IS_AUTHENTICATED_FULLY', null, [], true);

        $templateType = $this->templateProvider->getTemplate($type);
        $templates = $this->om->getRepository(Template::class)->findBy(['type' => $type]);

        return new JsonResponse([
            'type' => [
                'name' => $templateType::getName(),
                'type' => $templateType::getType(),
                'placeholders' => $templateType->getPlaceholders(),
            ],
            'templates' => array_map(function (Template $template) {
                return $this->serializer->serialize($template);
            }, $templates),
        ]);
    }
}
