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
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\TemplateBundle\Entity\Template;
use Claroline\TemplateBundle\Entity\TemplateContent;
use Claroline\TemplateBundle\Entity\TemplateType;
use Doctrine\Persistence\ObjectRepository;

class TemplateSerializer
{
    use SerializerTrait;

    private ObjectRepository $templateRepo;
    private ObjectRepository $templateTypeRepo;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly TemplateTypeSerializer $typeSerializer
    ) {
        $this->templateRepo = $om->getRepository(Template::class);
        $this->templateTypeRepo = $om->getRepository(TemplateType::class);
    }

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
            'type' => $this->typeSerializer->serialize($template->getType()),
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

    public function deserialize(array $data, Template $template): Template
    {
        $this->sipe('id', 'setUuid', $data, $template);
        $this->sipe('name', 'setName', $data, $template);

        if (isset($data['type'])) {
            $templateType = isset($data['type']['id']) ?
                $this->templateTypeRepo->findOneBy(['uuid' => $data['type']['id']]) :
                null;

            if ($templateType) {
                $template->setType($templateType);
            }
        }

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

        // TODO : should not be managed here
        if (isset($data['defineAsDefault']) && $template->getType()) {
            $templateType = $template->getType();
            $templateType->setDefaultTemplate($template->getName());
            $this->om->persist($templateType);
        }

        return $template;
    }
}
