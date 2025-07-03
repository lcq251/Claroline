<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Tool;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Tool\ToolMaskDecoder;

class ToolMaskDecoderManager
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    /**
     * Create a mask decoder with default actions for a tool.
     */
    public function createDefaultToolMaskDecoders(string $toolName): void
    {
        foreach (ToolMaskDecoder::DEFAULT_ACTIONS as $action) {
            $maskDecoder = $this->getDecoder($toolName, $action);
            if (empty($maskDecoder)) {
                $this->createToolMaskDecoder($toolName, $action, ToolMaskDecoder::DEFAULT_VALUES[$action]);
            }
        }
    }

    public function createCustomToolMaskDecoders(string $toolName, array $customRights): void
    {
        $decoders = $this->om->getRepository(ToolMaskDecoder::class)->findBy([
            'tool' => $toolName,
        ]);

        $nb = count(ToolMaskDecoder::DEFAULT_ACTIONS);
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
                $this->createToolMaskDecoder($toolName, $right, $value);
            } else {
                $maskDecoder->setValue($value);
                $this->om->persist($maskDecoder);
            }
            ++$nb;
        }
    }

    /**
     * Create a specific mask decoder for a tool.
     */
    public function createToolMaskDecoder(string $toolName, string $action, int $value): void
    {
        $maskDecoder = new ToolMaskDecoder();
        $maskDecoder->setTool($toolName);
        $maskDecoder->setName($action);
        $maskDecoder->setValue($value);

        $this->om->persist($maskDecoder);
        $this->om->flush();
    }

    public function removeToolMaskDecoder(string $toolName, string $action): void
    {
        $toolDecoders = $this->getDecoders($toolName);
        foreach ($toolDecoders as $index => $toolDecoder) {
            if ($toolDecoder->getName() === $action) {
                unset($this->maskDecoders[$toolName][$index]);
                $this->om->remove($toolDecoder);

                return;
            }
        }
    }

    /**
     * Returns an array containing the permission for a mask and a tool.
     */
    public function decodeMask(string $toolName, int $mask): array
    {
        $perms = [];

        $decoders = $this->getDecoders($toolName);
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
    public function encodeMask(string $toolName, array $perms): int
    {
        $mask = 0;

        $decoders = $this->getDecoders($toolName);
        foreach ($decoders as $decoder) {
            if (isset($perms[$decoder->getName()])) {
                $mask += $perms[$decoder->getName()] ? $decoder->getValue() : 0;
            }
        }

        return $mask;
    }

    /**
     * @return ToolMaskDecoder[]
     */
    public function getDecoders(string $toolName): array
    {
        return $this->om->getRepository(ToolMaskDecoder::class)->findBy(['tool' => $toolName]);
    }

    public function getDecoder(string $toolName, string $name): ?ToolMaskDecoder
    {
        $toolDecoders = $this->getDecoders($toolName);
        foreach ($toolDecoders as $toolDecoder) {
            if (strtolower($toolDecoder->getName()) === strtolower($name)) {
                return $toolDecoder;
            }
        }

        return null;
    }
}
