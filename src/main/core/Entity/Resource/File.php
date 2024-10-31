<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Resource;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'claro_file')]
#[ORM\Entity]
class File extends AbstractResource
{
    // propose to download raw file when opening the resource
    public const OPENING_DOWNLOAD = 'download';
    // try to use the browser player to display the file
    public const OPENING_BROWSER = 'browser';
    // use the claroline file player to display the file
    public const OPENING_PLAYER = 'player';

    #[ORM\Column(type: Types::INTEGER, nullable: false)]
    private ?int $size = null;

    #[ORM\Column(name: 'hash_name')]
    private ?string $hashName = null;

    #[ORM\Column]
    private string $opening = self::OPENING_PLAYER;

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): void
    {
        $this->size = $size;
    }

    public function getOpening(): string
    {
        return $this->opening;
    }

    public function setOpening(string $opening): void
    {
        $this->opening = $opening;
    }

    /**
     * Returns the name of the file actually stored in the file directory (as
     * opposed to the file original name, which is kept in the entity name
     * attribute).
     */
    public function getHashName(): ?string
    {
        return $this->hashName;
    }

    /**
     * Sets the name of the physical file that will be stored in the file directory.
     * To prevent file name issues (e.g. with special characters), the original
     * file should be renamed with a standard unique identifier.
     */
    public function setHashName(string $hashName): void
    {
        $this->hashName = $hashName;
    }
}
