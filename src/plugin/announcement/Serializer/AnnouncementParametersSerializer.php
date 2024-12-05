<?php

namespace Claroline\AnnouncementBundle\Serializer;

use Claroline\AnnouncementBundle\Entity\AnnouncementParameters;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\TemplateBundle\Entity\Template;
use Claroline\TemplateBundle\Serializer\TemplateSerializer;

class AnnouncementParametersSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly TemplateSerializer $templateSerializer
    ) {
    }

    public function getName(): string
    {
        return 'announcement_tool';
    }

    public function getClass(): string
    {
        return AnnouncementParameters::class;
    }

    public function serialize(AnnouncementParameters $announcement, ?array $options = []): array
    {
        $serialized = [];

        if ($announcement->getTemplateEmail()) {
            $serialized['templateEmail'] = $this->templateSerializer->serialize($announcement->getTemplateEmail(), [SerializerInterface::SERIALIZE_MINIMAL]);
        }
        if ($announcement->getTemplatePdf()) {
            $serialized['templatePdf'] = $this->templateSerializer->serialize($announcement->getTemplatePdf(), [SerializerInterface::SERIALIZE_MINIMAL]);
        }

        return $serialized;
    }

    public function deserialize(array $data, AnnouncementParameters $announcement, ?array $options = []): AnnouncementParameters
    {
        if (array_key_exists('templateEmail', $data)) {
            $template = null;
            if (!empty($data['templateEmail']) && !empty($data['templateEmail']['id'])) {
                $template = $this->om->getRepository(Template::class)->findOneBy(['uuid' => $data['templateEmail']['id']]);
            }

            $announcement->setTemplateEmail($template);
        }

        if (array_key_exists('templatePdf', $data)) {
            $template = null;
            if (!empty($data['templatePdf']) && !empty($data['templatePdf']['id'])) {
                $template = $this->om->getRepository(Template::class)->findOneBy(['uuid' => $data['templatePdf']['id']]);
            }

            $announcement->setTemplatePdf($template);
        }

        return $announcement;
    }
}
