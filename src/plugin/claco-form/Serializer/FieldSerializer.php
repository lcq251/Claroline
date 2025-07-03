<?php

namespace Claroline\ClacoFormBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ClacoFormBundle\Entity\Field;
use Claroline\CoreBundle\API\Serializer\Facet\FieldFacetSerializer;

class FieldSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly FieldFacetSerializer $fieldFacetSerializer
    ) {
    }

    public function getClass(): string
    {
        return Field::class;
    }

    public function getName(): string
    {
        return 'clacoform_field';
    }

    public function serialize(Field $field, array $options = []): array
    {
        return $this->fieldFacetSerializer->serialize($field->getFieldFacet(), $options);
    }

    public function deserialize(array $data, Field $field, array $options = []): Field
    {
        $this->fieldFacetSerializer->deserialize($data, $field->getFieldFacet(), $options);

        return $field;
    }
}
