<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TemplateBundle\Serializer;

use Claroline\TemplateBundle\Entity\TemplateType;

class TemplateTypeSerializer
{
    public function serialize(TemplateType $templateType): array
    {
        return [
            'id' => $templateType->getUuid(),
            'name' => $templateType->getName(),
            'type' => $templateType->getType(),
            'placeholders' => $templateType->getPlaceholders(),
            'defaultTemplate' => $templateType->getDefaultTemplate(),
        ];
    }

    public function getName(): string
    {
        return 'template_type';
    }

    public function getClass(): string
    {
        return TemplateType::class;
    }
}
