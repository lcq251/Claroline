<?php

namespace Claroline\CoreBundle\Event\Facet;

use Symfony\Contracts\EventDispatcher\Event;

abstract class AbstractFacetValueEvent extends Event
{
    /**
     * The parent object which holds the facets feature (e.g. User, ClacoForm Entry).
     */
    private object $object;

    private string $fieldType;
    private mixed $value;
    private mixed $formattedValue;

    public function __construct(object $object, string $fieldType, mixed $value)
    {
        $this->object = $object;
        $this->fieldType = $fieldType;
        $this->value = $value;
        $this->formattedValue = $value;
    }

    public function getObject(): object
    {
        return $this->object;
    }

    public function getFieldType(): string
    {
        return $this->fieldType;
    }

    public function getValue(): mixed
    {
        return $this->value;
    }

    public function getFormattedValue(): mixed
    {
        return $this->formattedValue;
    }

    public function setFormattedValue(mixed $formattedValue): void
    {
        $this->formattedValue = $formattedValue;
    }
}
