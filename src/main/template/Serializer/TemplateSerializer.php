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

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\TemplateBundle\Entity\Template;
use Claroline\TemplateBundle\Entity\TemplateContent;

class TemplateSerializer
{
    use SerializerTrait;

    public function getName(): string
    {
        return 'template';
    }

    public function getClass(): string
    {
        return Template::class;
    }

    public function serialize(Template $template, array $options = []): array
    {
        $serialized = [
            'id' => $template->getUuid(),
            'name' => $template->getName(),
            'type' => $template->getType(),
            'description' => $template->getDescription(),
            'default' => $template->isDefault(),
            'system' => $template->isSystem(),
        ];

        if (!in_array(SerializerInterface::SERIALIZE_MINIMAL, $options) && !in_array(SerializerInterface::SERIALIZE_LIST, $options)) {
            $contents = [];
            foreach ($template->getTemplateContents() as $content) {
                $contents[$content->getLang()] = [
                    'title' => $content->getTitle(),
                    'content' => $content->getContent(),
                ];
            }

            if (!empty($contents)) {
                // UI expects an object here, if we expose an empty array it will break the form state
                $serialized['contents'] = $contents;
            }
        }

        return $serialized;
    }

    public function deserialize(array $data, Template $template, ?array $options = []): Template
    {
        if (!in_array(SerializerInterface::REFRESH_UUID, $options)) {
            $this->sipe('id', 'setUuid', $data, $template);
        } else {
            $template->refreshUuid();
        }

        $this->sipe('name', 'setName', $data, $template);
        $this->sipe('type', 'setType', $data, $template);
        $this->sipe('description', 'setDescription', $data, $template);

        if (isset($data['contents'])) {
            foreach ($data['contents'] as $locale => $localizedData) {
                $content = $template->getTemplateContent($locale);
                if (empty($content)) {
                    $content = new TemplateContent();
                    $content->setLang($locale);
                    $template->addTemplateContent($content);
                }

                $this->sipe('title', 'setTitle', $localizedData, $content);
                $this->sipe('content', 'setContent', $localizedData, $content);
            }
        }

        return $template;
    }
}
