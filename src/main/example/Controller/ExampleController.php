<?php

namespace Claroline\ExampleBundle\Controller;

use Claroline\AppBundle\API\Finder\FinderFactory;
use Claroline\AppBundle\API\Finder\FinderQuery;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Finder\PlannedObjectType;
use Claroline\ExampleBundle\Entity\Example;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

#[Route(path: '/example', name: 'apiv2_example_')]
class ExampleController extends AbstractCrudController
{
    public function __construct(private readonly FinderFactory $finder)
    {
    }

    public static function getName(): string
    {
        return 'example';
    }

    public static function getClass(): string
    {
        return Example::class;
    }

    #[Route(path: '/test', name: 'test', methods: ['GET'])]
    public function testAction(
        #[MapQueryString]
        ?FinderQuery $finderQuery = new FinderQuery()
    ): StreamedJsonResponse {
        $finder = $this->finder->create(PlannedObjectType::class)
            ->submit($finderQuery)
            ->getResult(function (object $row): array {
                return $this->serializer->serialize($row, [SerializerInterface::SERIALIZE_MINIMAL]);
            })
        ;

        $queryParams = $finder->getQuery()->getParameters()->toArray();

        return new StreamedJsonResponse([
            'sql' => $finder->getQuery()->getSQL(),
            'parameters' => array_map(function ($parameter) {
                return [
                    'name' => $parameter->getName(),
                    // 'type' => $parameter->getType(),
                    'value' => $parameter->getValue(),
                ];
            }, $queryParams),
            'data' => $finder->getItems(),
        ]);
    }
}
