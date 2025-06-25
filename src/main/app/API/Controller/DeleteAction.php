<?php

namespace Claroline\AppBundle\API\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

trait DeleteAction
{
    use CrudAction;

    abstract protected function decodeIdsString(Request $request, string $class, string $property = 'ids'): array;

    #[Route(path: '/', name: 'delete', methods: ['DELETE'])]
    public function deleteBulkAction(Request $request): JsonResponse
    {
        $options = static::getOptions();

        $this->getCrud()->deleteBulk(
            $this->decodeIdsString($request, static::getClass()),
            $options['delete'] ?? []
        );

        return new JsonResponse(null, 204);
    }
}
