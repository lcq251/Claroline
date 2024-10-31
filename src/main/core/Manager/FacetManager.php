<?php

namespace Claroline\CoreBundle\Manager;

use Claroline\AppBundle\API\Utils\ArrayUtils;
use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use Claroline\CoreBundle\Event\CatalogEvents\FacetEvents;
use Claroline\CoreBundle\Event\Facet\GetFacetValueEvent;
use Claroline\CoreBundle\Event\Facet\SetFacetValueEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class FacetManager
{
    private EventDispatcherInterface $dispatcher;

    public function __construct(EventDispatcherInterface $dispatcher)
    {
        $this->dispatcher = $dispatcher;
    }

    public function serializeFieldValue($object, $type, $value = null)
    {
        $event = new GetFacetValueEvent(
            $object,
            $type,
            $value
        );

        $this->dispatcher->dispatch($event, FacetEvents::getEventName(FacetEvents::GET_VALUE, $type));

        return $event->getFormattedValue();
    }

    public function deserializeFieldValue($object, $type, $value = null)
    {
        $event = new SetFacetValueEvent(
            $object,
            $type,
            $value
        );

        $this->dispatcher->dispatch($event, FacetEvents::getEventName(FacetEvents::SET_VALUE, $type));

        return $event->getFormattedValue();
    }

    public function isFieldDisplayed(FieldFacet $fieldDef, array $allFields, array $data): bool
    {
        if (empty($fieldDef->getConditionField())) {
            // the field is not linked to another
            return true;
        }

        // retrieve the parent field
        $parentField = null;
        foreach ($allFields as $searchedField) {
            if ($searchedField === $fieldDef->getConditionField()) {
                $parentField = $searchedField;
            }
        }

        // check if the parent field value match the display condition value
        if ($parentField) {
            $parentValue = ArrayUtils::get($data, 'profile.'.$parentField->getUuid());

            $displayed = false;

            switch ($fieldDef->getConditionComparator()) {
                case 'equal':
                    $displayed = $parentValue === $fieldDef->getConditionValue();
                    break;
                case 'different':
                    $displayed = $parentValue !== $fieldDef->getConditionValue();
                    break;
                case 'empty':
                    $displayed = empty($parentValue);
                    break;
                case 'not_empty':
                    $displayed = !empty($parentValue);
                    break;
            }

            return $displayed;
        }

        return true;
    }
}
