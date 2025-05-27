<?php

namespace Claroline\AppBundle\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\AppBundle\Manager\PlatformManager;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RouterInterface;

/**
 * Manages the documentation for the REST api.
 * It exposes the endpoints of the api and the schemas for the managed resources.
 */
class DocumentationProvider
{
    public function __construct(
        private readonly RouterInterface $router,
        private readonly PlatformManager $platformManager,
        private readonly SchemaProvider $schemaProvider
    ) {
    }

    /**
     * Get the whole api documentation.
     */
    public function get(): array
    {
        return [
            'swagger' => '2.0',
            'basePath' => $this->platformManager->getUrl(),
            'paths' => $this->getPaths(),
            'definitions' => $this->getDefinitions(),
        ];
    }

    private function getPaths(): array
    {
        $classes = $this->getClasses();

        $paths = [];
        foreach ($classes as $class) {
            $paths = array_merge($paths, $this->documentRoutes($class));
        }

        return $paths;
    }

    private function getDefinitions(): array
    {
        $classes = $this->getClasses();

        $definitions = [];
        foreach ($classes as $class) {
            $def = json_decode(json_encode($this->schemaProvider->getSchema($class)), true);
            if (!empty($def)) {
                $definitions[$class] = $def;
            }
        }

        return $definitions;
    }

    /**
     * Documents all the routes declared in the AbstractCrudController of the class.
     */
    private function documentRoutes(string $class): array
    {
        $routes = $this->getRoutes($class);

        $documented = [];
        foreach ($routes->getIterator() as $route) {
            $method = strtolower(isset($route->getMethods()[0]) ? $route->getMethods()[0] : 'get');
            $documented[$route->getPath()][$method] = $this->documentRoute($route);
            $documented[$route->getPath()][$method]['tags'] = [$class];
        }

        return $documented;
    }

    private function documentRoute(Route $route): array
    {
        return [
            'description' => null,
            'parameters' => [],
            'produce' => ['application/json'],
        ];
    }

    /**
     * Gets all the entities managed by the API.
     *
     * NB. For now, this is all the entities with an AbstractCrudController.
     * This means the list is incomplete because the use of AbstractCrudController is not mandatory.
     */
    private function getClasses(): array
    {
        $classes = [];

        $collection = $this->router->getRouteCollection();

        foreach ($collection->getIterator() as $route) {
            $defaults = $route->getDefaults();
            if (isset($defaults['_controller'])) {
                $controllerClass = explode(':', $defaults['_controller'])[0];
                if (class_exists($controllerClass)) {
                    $refClass = new \ReflectionClass($controllerClass);

                    if ($refClass->isSubClassOf(AbstractCrudController::class)) {
                        if (!in_array($controllerClass::getClass(), $classes)) {
                            $classes[] = $controllerClass::getClass();
                        }
                    }
                }
            }
        }

        return array_values($classes);
    }

    private function getRoutes(string $class): RouteCollection
    {
        $collection = $this->router->getRouteCollection();
        $describeCollection = new RouteCollection();

        foreach ($collection->getIterator() as $key => $route) {
            $defaults = $route->getDefaults();
            if (isset($defaults['_controller'])) {
                $controllerClass = explode(':', $defaults['_controller'])[0];
                if (class_exists($controllerClass)) {
                    $refClass = new \ReflectionClass($controllerClass);

                    if ($refClass->isSubClassOf(AbstractCrudController::class)) {
                        if ($class === $controllerClass::getClass()) {
                            $describeCollection->add($key, $route);
                        }
                    }
                }
            }
        }

        return $describeCollection;
    }
}
