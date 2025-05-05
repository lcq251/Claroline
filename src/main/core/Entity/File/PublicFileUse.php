<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\File;

use Claroline\AppBundle\Entity\Identifier\Id;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_public_file_use')]
class PublicFileUse
{
    use Id;

    #[ORM\JoinColumn(name: 'public_file_id', onDelete: 'CASCADE')]
    #[ORM\ManyToOne(targetEntity: PublicFile::class)]
    protected ?PublicFile $publicFile = null;

    #[ORM\Column(name: 'object_uuid')]
    protected ?string $objectUuid = null;

    #[ORM\Column(name: 'object_class')]
    protected ?string $objectClass = null;

    #[ORM\Column(name: 'object_name', nullable: true)]
    protected ?string $objectName = null;

    public function getPublicFile(): ?PublicFile
    {
        return $this->publicFile;
    }

    public function setPublicFile(PublicFile $publicFile): void
    {
        $this->publicFile = $publicFile;
    }

    public function getObjectUuid(): ?string
    {
        return $this->objectUuid;
    }

    public function setObjectUuid(string $objectUuid): void
    {
        $this->objectUuid = $objectUuid;
    }

    public function getObjectClass(): ?string
    {
        return $this->objectClass;
    }

    public function setObjectClass(string $objectClass): void
    {
        $this->objectClass = $objectClass;
    }

    public function getObjectName(): ?string
    {
        return $this->objectName;
    }

    public function setObjectName(?string $objectName): void
    {
        $this->objectName = $objectName;
    }
}
