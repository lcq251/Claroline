<?php

namespace Claroline\AppBundle\Controller\Component;

use Claroline\AppBundle\Component\Context\ContextProvider;
use Claroline\AppBundle\Component\DataSource\DataSourceProvider;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Exposes platform data sources.
 */
#[Route(path: '/data_source')]
class DataSourceController
{
    public function __construct(
        private readonly ContextProvider $contextProvider,
        private readonly DataSourceProvider $dataSourceProvider
    ) {
    }

    /**
     * Gets data from a data source.
     */
    #[Route(path: '/{type}/{context}/{contextId}', name: 'apiv2_data_source', defaults: ['contextId' => null], methods: ['GET'])]
    public function openAction(
        Request $request,
        string $type,
        string $context,
        ?string $contextId = null
    ): Response {
        try {
            $contextHandler = $this->contextProvider->getContext($context, $contextId);
            $contextSubject = $contextHandler->getObject($contextId);

            $dataSource = $this->dataSourceProvider->getDataSource($type, $context, $contextSubject);
        } catch (\Exception $e) {
            throw new NotFoundHttpException($e->getMessage());
        }

        return $dataSource->open($context, $contextSubject, $request);
    }
}
