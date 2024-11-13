<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\ClacoFormBundle\Repository\FieldValueRepository;
use Claroline\CoreBundle\Entity\Facet\FieldFacetValue;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_clacoformbundle_field_value')]
#[ORM\UniqueConstraint(name: 'field_unique_name', columns: ['entry_id', 'field_id'])]
#[ORM\Entity(repositoryClass: FieldValueRepository::class)]
class FieldValue
{
    use Id;
    use Uuid;

    #[ORM\JoinColumn(name: 'entry_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Entry::class, cascade: ['persist'], inversedBy: 'fieldValues')]
    protected ?Entry $entry = null;

    #[ORM\JoinColumn(name: 'field_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: Field::class)]
    protected ?Field $field = null;

    #[ORM\JoinColumn(name: 'field_facet_value_id', onDelete: 'CASCADE')]
    #[ORM\OneToOne(targetEntity: FieldFacetValue::class, cascade: ['persist'])]
    protected ?FieldFacetValue $fieldFacetValue = null;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getEntry(): ?Entry
    {
        return $this->entry;
    }

    public function setEntry(Entry $entry): void
    {
        $this->entry = $entry;
    }

    public function getField(): ?Field
    {
        return $this->field;
    }

    public function setField(Field $field): void
    {
        $this->field = $field;
    }

    public function getFieldFacetValue(): ?FieldFacetValue
    {
        return $this->fieldFacetValue;
    }

    public function setFieldFacetValue(FieldFacetValue $fieldFacetValue): void
    {
        $this->fieldFacetValue = $fieldFacetValue;
    }

    public function getValue(): mixed
    {
        return !empty($this->fieldFacetValue) ? $this->fieldFacetValue->getValue() : null;
    }

    public function setValue(mixed $value): void
    {
        if (!empty($this->fieldFacetValue)) {
            $this->fieldFacetValue->setValue($value);
        }
    }
}
