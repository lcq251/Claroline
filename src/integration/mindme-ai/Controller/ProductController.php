<?php

namespace Claroline\MindMeAiBundle\Controller;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Finder\FinderRequest;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\Registration\AbstractRegistration;
use Claroline\CursusBundle\Manager\SessionManager;
use Claroline\MindMeAiBundle\Entity\Product;
use Claroline\MindMeAiBundle\Entity\ProductStatus;
use Claroline\MindMeAiBundle\Serializer\ProductSerializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedJsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Unified product CRUD + free enablement (route B).
 *
 * GET    /apiv2/product              - list approved products
 * GET    /apiv2/product/{id}         - one product (by uuid)
 * POST   /apiv2/product              - publish (create) a product
 * POST   /apiv2/product/{id}/enable  - free enablement (grants access, no payment)
 * DELETE /apiv2/product/{id}         - unpublish (delete) a product
 */
class ProductController
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly ProductSerializer $serializer,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly RightsManager $rightsManager,
        private readonly RoleManager $roleManager,
        private readonly SessionManager $sessionManager,
        private readonly Crud $crud,
    ) {
    }

    #[Route('/apiv2/product', name: 'apiv2_mindme_product_list', methods: ['GET'])]
    public function list(
        #[MapQueryString]
        ?FinderRequest $finderRequest = new FinderRequest()
    ): StreamedJsonResponse {
        $results = $this->crud->search(Product::class, $finderRequest, [SerializerInterface::SERIALIZE_LIST]);

        return $results->toResponse();
    }

    #[Route('/apiv2/product/{id}', name: 'apiv2_mindme_product_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        $product = $this->om->getRepository(Product::class)->findOneBy(['uuid' => $id]);

        if (!$product) {
            return new JsonResponse(['message' => 'Product not found'], 404);
        }

        return new JsonResponse($this->serializer->serialize($product));
    }

    #[Route('/apiv2/product', name: 'apiv2_mindme_product_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['message' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return new JsonResponse(['message' => 'Invalid payload'], 400);
        }

        $targetType = (string) ($data['targetType'] ?? '');
        $targetId = (int) ($data['targetId'] ?? 0);

        if (!in_array($targetType, ['resource', 'course'], true) || $targetId <= 0) {
            return new JsonResponse(['message' => 'Invalid targetType/targetId'], 400);
        }

        // validate the published target actually exists
        $targetRepo = 'resource' === $targetType ? ResourceNode::class : Course::class;
        if (!$this->om->getRepository($targetRepo)->find($targetId)) {
            return new JsonResponse(['message' => 'Target not found'], 404);
        }

        // code: explicit or auto-generated, must be unique
        $code = trim((string) ($data['code'] ?? ''));
        if ('' === $code) {
            $code = 'P-'.('resource' === $targetType ? 'r' : 'c').'-'.$targetId.'-'.substr(bin2hex(random_bytes(4)), 0, 6);
        }
        if ($this->om->getRepository(Product::class)->findOneBy(['code' => $code])) {
            return new JsonResponse(['message' => 'Product code already exists'], 409);
        }

        $product = new Product();
        $product->setTargetType($targetType);
        $product->setTargetId($targetId);
        $product->setCode($code);
        $product->setStatus(ProductStatus::APPROVED);
        $product->setCreator($user);

        if (isset($data['price'])) {
            $product->setPrice(null !== $data['price'] ? (float) $data['price'] : null);
        }
        if (isset($data['description'])) {
            $product->setDescription((string) $data['description']);
        }

        $this->om->persist($product);
        $this->om->flush();

        return new JsonResponse($this->serializer->serialize($product), 201);
    }

    /**
     * Free enablement (route B, no payment): grants the current user access to
     * the product's target — resource gets OPEN right, course gets registered.
     */
    #[Route('/apiv2/product/{id}/enable', name: 'apiv2_mindme_product_enable', methods: ['POST'])]
    public function enable(string $id): JsonResponse
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['message' => 'Forbidden'], 403);
        }

        $product = $this->om->getRepository(Product::class)->findOneBy(['uuid' => $id]);
        if (!$product) {
            return new JsonResponse(['message' => 'Product not found'], 404);
        }

        if ('resource' === $product->getTargetType()) {
            $node = $this->om->getRepository(ResourceNode::class)->find($product->getTargetId());
            if (!$node) {
                return new JsonResponse(['message' => 'Target resource not found'], 404);
            }

            $this->enableResource($user, $node);
        } else {
            $course = $this->om->getRepository(Course::class)->find($product->getTargetId());
            if (!$course) {
                return new JsonResponse(['message' => 'Target course not found'], 404);
            }

            $this->enableCourse($user, $course);
        }

        return new JsonResponse(['status' => 'enabled'], 200);
    }

    #[Route('/apiv2/product/{id}', name: 'apiv2_mindme_product_delete', methods: ['DELETE'])]
    public function delete(string $id): JsonResponse
    {
        $product = $this->om->getRepository(Product::class)->findOneBy(['uuid' => $id]);

        if (!$product) {
            return new JsonResponse(['message' => 'Product not found'], 404);
        }

        $this->om->remove($product);
        $this->om->flush();

        return new JsonResponse(null, 204);
    }

    /**
     * Grants the user OPEN right on the resource via their personal role
     * (ROLE_USER_<username>), so access is scoped to this user only.
     */
    private function enableResource(User $user, ResourceNode $node): void
    {
        $role = $this->om->getRepository(Role::class)->findOneBy([
            'name' => 'ROLE_USER_'.strtoupper($user->getUsername()),
        ]);

        if (!$role) {
            $role = $this->roleManager->createUserRole($user);
        }

        // mask 1 = OPEN
        $this->rightsManager->create(1, $role, $node);

        $this->om->flush();
    }

    /**
     * Registers the user to the course's default session (validated, no approval).
     */
    private function enableCourse(User $user, Course $course): void
    {
        $session = $course->getDefaultSession();

        if (!$session) {
            return;
        }

        $this->sessionManager->addUsers($session, [$user], AbstractRegistration::LEARNER, true);
    }
}
