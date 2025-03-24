<?php

namespace Claroline\ClacoFormBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\ClacoFormBundle\Entity\Category;
use Claroline\ClacoFormBundle\Entity\ClacoForm;
use Claroline\ClacoFormBundle\Entity\Entry;
use Claroline\ClacoFormBundle\Entity\Field;
use Claroline\ClacoFormBundle\Entity\FieldValue;
use Claroline\ClacoFormBundle\Repository\CategoryRepository;
use Claroline\ClacoFormBundle\Repository\ClacoFormRepository;
use Claroline\ClacoFormBundle\Repository\FieldRepository;
use Claroline\CommunityBundle\Repository\UserRepository;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\Entity\Facet\FieldFacetValue;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\CoreBundle\Manager\FacetManager;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class EntrySerializer
{
    use SerializerTrait;

    private ClacoFormRepository $clacoFormRepo;
    private FieldRepository $fieldRepo;
    private CategoryRepository $categoryRepo;
    private UserRepository $userRepo;

    public function __construct(
        ObjectManager $om,
        private readonly AuthorizationCheckerInterface $authorization,
        private readonly CategorySerializer $categorySerializer,
        private readonly UserSerializer $userSerializer,
        private readonly FacetManager $facetManager
    ) {
        $this->clacoFormRepo = $om->getRepository(ClacoForm::class);
        $this->fieldRepo = $om->getRepository(Field::class);
        $this->categoryRepo = $om->getRepository(Category::class);
        $this->userRepo = $om->getRepository(User::class);
    }

    public function getClass(): string
    {
        return Entry::class;
    }

    public function getName(): string
    {
        return 'clacoform_entry';
    }

    /**
     * Serializes an Entry entity for the JSON api.
     *
     * @param Entry $entry   - the entry to serialize
     * @param array $options - a list of serialization options
     *
     * @return array - the serialized representation of the entry
     */
    public function serialize(Entry $entry, array $options = []): array
    {
        $user = $entry->getUser();

        $serialized = [
            'id' => $entry->getUuid(),
            'autoId' => $entry->getId(),
            'title' => $entry->getTitle(),
            'status' => $entry->getStatus(),
            'locked' => $entry->isLocked(),
            'creationDate' => DateNormalizer::normalize($entry->getCreationDate()),
            'editionDate' => DateNormalizer::normalize($entry->getEditionDate()),
            'publicationDate' => DateNormalizer::normalize($entry->getPublicationDate()),
            'user' => $user ? $this->userSerializer->serialize($user, [SerializerInterface::SERIALIZE_MINIMAL]) : null,
            'clacoForm' => [ // should not be exposed here
                'id' => $entry->getClacoForm()->getUuid(),
            ],
        ];

        $fieldValues = $this->serializeValues($entry);
        if (!empty($fieldValues)) {
            // don't send an empty array, because the ui expect an object here
            $serialized['values'] = $fieldValues;
        }

        if (!in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            $isAdmin = $this->authorization->isGranted('ADMINISTRATE', $entry);
            $serialized['permissions'] = [
                'open' => $isAdmin || $this->authorization->isGranted('OPEN', $entry),
                'edit' => $isAdmin || $this->authorization->isGranted('EDIT', $entry),
                'administrate' => $isAdmin,
                'delete' => $isAdmin || $this->authorization->isGranted('DELETE', $entry),
            ];

            $serialized = array_merge($serialized, [
                'categories' => $this->getCategories($entry),
            ]);
        }

        return $serialized;
    }

    public function deserialize(array $data, Entry $entry, array $options = []): Entry
    {
        if (!in_array(SerializerInterface::REFRESH_UUID, $options)) {
            $this->sipe('id', 'setUuid', $data, $entry);
        } else {
            $entry->refreshUuid();
        }

        $this->sipe('title', 'setTitle', $data, $entry);
        $this->sipe('status', 'setStatus', $data, $entry);

        if (isset($data['user']['id'])) {
            $user = $this->userRepo->findOneBy(['uuid' => $data['user']['id']]);

            if (!empty($user)) {
                $entry->setUser($user);
            }
        }
        if (isset($data['clacoForm']['id']) && !$entry->getClacoForm()) {
            $clacoForm = $this->clacoFormRepo->findOneBy(['uuid' => $data['clacoForm']['id']]);
            $entry->setClacoForm($clacoForm);
        }

        if (isset($data['categories'])) {
            $this->deserializeCategories($entry, $data['categories']);
        }

        if ($entry->getClacoForm()) {
            $clacoForm = $entry->getClacoForm();

            // Initializes status
            if (empty($entry->getStatus())) {
                $status = $clacoForm->isModerated() ? Entry::PENDING : Entry::PUBLISHED;
                $entry->setStatus($status);

                if (Entry::PUBLISHED === $status) {
                    $entry->setPublicationDate(new \DateTime());
                }
            }

            // Sets values for fields
            $fields = $clacoForm->getFields();
            foreach ($fields as $field) {
                if (array_key_exists($field->getUuid(), $data['values'])) {
                    $fieldValue = $entry->getFieldValue($field);
                    if (empty($fieldValue)) {
                        $fieldValue = new FieldValue();
                        $fieldValue->setEntry($entry);
                        $fieldValue->setField($field);

                        $fieldFacetValue = new FieldFacetValue();
                        $fieldFacetValue->setUser($entry->getUser());
                        $fieldFacetValue->setFieldFacet($field->getFieldFacet());
                        $fieldValue->setFieldFacetValue($fieldFacetValue);

                        $entry->addFieldValue($fieldValue);
                    }

                    $fieldValue->setValue(
                        $this->facetManager->deserializeFieldValue(
                            $entry,
                            $field->getType(),
                            $data['values'][$field->getUuid()]
                        )
                    );
                }
            }
        }

        return $entry;
    }

    private function serializeValues(Entry $entry): array
    {
        $fieldValues = $entry->getFieldValues();

        $values = [];
        foreach ($fieldValues as $fieldValue) {
            $field = $fieldValue->getField();
            $values[$field->getUuid()] = $this->facetManager->serializeFieldValue(
                $entry,
                $field->getType(),
                $fieldValue->getValue()
            );
        }

        return $values;
    }

    private function getCategories(Entry $entry): array
    {
        return array_map(
            function (Category $category) {
                return $this->categorySerializer->serialize($category, [SerializerInterface::SERIALIZE_MINIMAL]);
            },
            $entry->getCategories()
        );
    }

    private function deserializeCategories(Entry $entry, array $categoriesData): Entry
    {
        $entry->emptyCategories();

        foreach ($categoriesData as $categoryData) {
            $category = $this->categoryRepo->findOneBy(['uuid' => $categoryData['id']]);

            if (!empty($category)) {
                $entry->addCategory($category);
            }
        }

        return $entry;
    }
}
