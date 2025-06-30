<?php

namespace Claroline\CoreBundle\API\Serializer\Resource\Types;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Library\Normalizer\TextNormalizer;
use Symfony\Component\Mime\MimeTypes;

class FileSerializer
{
    use SerializerTrait;

    public function getName(): string
    {
        return 'file';
    }

    /**
     * Serializes a File resource entity for the JSON api.
     *
     * @param File $file - the file to serialize
     *
     * @return array - the serialized representation of the file
     */
    public function serialize(File $file): array
    {
        $ext = pathinfo($file->getUrl(), PATHINFO_EXTENSION);
        if (empty($ext)) {
            $mimeTypeGuesser = new MimeTypes();
            $guessedExtension = $mimeTypeGuesser->getExtensions($file->getResourceNode()->getMimeType());
            if (!empty($guessedExtension)) {
                $ext = $guessedExtension[0];
            }
        }

        $fileName = TextNormalizer::toKey(str_replace('.'.$ext, '', $file->getResourceNode()->getName())).'.'.$ext;

        return [
            'id' => $file->getUuid(),
            'size' => $file->getSize(),
            'opening' => $file->getOpening(),
            'name' => $fileName, // the name of the file, which will be used for file download
            'url' => $file->getUrl(),
        ];
    }

    public function deserialize($data, File $file, array $options = []): File
    {
        if (!in_array(SerializerInterface::REFRESH_UUID, $options)) {
            $this->sipe('id', 'setUuid', $data, $file);
        } else {
            $file->refreshUuid();
        }

        $this->sipe('size', 'setSize', $data, $file);
        $this->sipe('url', 'setHashName', $data, $file);
        $this->sipe('opening', 'setOpening', $data, $file);

        return $file;
    }
}
