<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\MaskDecoder;
use Claroline\CoreBundle\Entity\Resource\ResourceType;

class MaskManager
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    /**
     * Returns an array containing the permission for a mask and a resource type.
     */
    public function decodeMask(int $mask, ResourceType $type): array
    {
        $perms = [];

        $decoders = $this->getDecoders($type);
        foreach ($decoders as $decoder) {
            $perms[$decoder->getName()] = ($mask & $decoder->getValue()) ? true : false;
        }

        return $perms;
    }

    /**
     * Encode a mask for an array of permission.
     *
     * @param array $perms The list of permissions in the format [ACTION_NAME => true|false]
     */
    public function encodeMask(array $perms, ResourceType $type): int
    {
        $mask = 0;

        $decoders = $this->getDecoders($type);
        foreach ($decoders as $decoder) {
            if (isset($perms[$decoder->getName()])) {
                $mask += $perms[$decoder->getName()] ? $decoder->getValue() : 0;
            }
        }

        return $mask;
    }

    /**
     * @return MaskDecoder[]
     */
    public function getDecoders(ResourceType $type): array
    {
        return $this->om->getRepository(MaskDecoder::class)->findBy(['resourceType' => $type]);
    }

    public function getDecoder(ResourceType $resourceType, string $name): ?MaskDecoder
    {
        $resourceDecoders = $this->getDecoders($resourceType);
        foreach ($resourceDecoders as $resourceDecoder) {
            if (strtolower($resourceDecoder->getName()) === strtolower($name)) {
                return $resourceDecoder;
            }
        }

        return null;
    }

    /**
     * Create a specific mask decoder for a resource type.
     */
    public function createResourceMaskDecoder(ResourceType $resourceType, string $action, int $value): void
    {
        $maskDecoder = new MaskDecoder();
        $maskDecoder->setResourceType($resourceType);
        $maskDecoder->setName($action);
        $maskDecoder->setValue($value);

        $this->om->persist($maskDecoder);
        $this->om->flush();
    }

    public function removeResourceMaskDecoder(ResourceType $resourceType, string $action): void
    {
        $resourceDecoders = $this->getDecoders($resourceType);
        foreach ($resourceDecoders as $resourceDecoder) {
            if ($resourceDecoder->getName() === $action) {
                $resourceType->removeMaskDecoder($resourceDecoder);

                return;
            }
        }
    }

    /**
     * Adds the default action to a resource type.
     */
    public function createDefaultResourceMaskDecoders(ResourceType $type): void
    {
        foreach (MaskDecoder::DEFAULT_ACTIONS as $action) {
            $maskDecoder = $this->getDecoder($type, $action);
            if (empty($maskDecoder)) {
                $this->createResourceMaskDecoder($type, $action, MaskDecoder::DEFAULT_VALUES[$action]);
            }
        }
    }

    public function createCustomResourceMaskDecoders(ResourceType $resourceType, array $customRights): void
    {
        $decoders = $this->om->getRepository(MaskDecoder::class)->findBy([
            'resourceType' => $resourceType,
        ]);

        $nb = count(MaskDecoder::DEFAULT_ACTIONS);
        foreach ($customRights as $right) {
            $maskDecoder = null;
            foreach ($decoders as $decoder) {
                if ($decoder->getName() === $right) {
                    $maskDecoder = $decoder;
                    break;
                }
            }

            $value = pow(2, $nb);
            if (empty($maskDecoder)) {
                $this->createResourceMaskDecoder($resourceType, $right, $value);
            } else {
                $maskDecoder->setValue($value);
                $this->om->persist($maskDecoder);
            }
            ++$nb;
        }
    }
}
