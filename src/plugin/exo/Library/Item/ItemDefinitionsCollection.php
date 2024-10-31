<?php

namespace UJM\ExoBundle\Library\Item;

use UJM\ExoBundle\Library\Item\Definition\ContentItemDefinition;
use UJM\ExoBundle\Library\Item\Definition\Exception\UnregisterableDefinitionException;
use UJM\ExoBundle\Library\Item\Definition\Exception\UnregisteredDefinitionException;
use UJM\ExoBundle\Library\Item\Definition\ItemDefinitionInterface;

/**
 * Collects definition class for each Item type defined.
 */
class ItemDefinitionsCollection
{
    /**
     * The list of registered item definitions.
     *
     * @var ItemDefinitionInterface[]
     */
    private array $definitions = [];

    /**
     * Adds an item definition to the collection.
     *
     * @throws UnregisterableDefinitionException
     */
    public function addDefinition(ItemDefinitionInterface $definition): void
    {
        if (!is_string($definition::getMimeType())) {
            throw UnregisterableDefinitionException::notAStringMimeType($definition);
        }

        if (!in_array($definition::getMimeType(), ItemType::getList())) {
            throw UnregisterableDefinitionException::unsupportedMimeType($definition);
        }

        if ($this->has($definition::getMimeType())) {
            throw UnregisterableDefinitionException::duplicateMimeType($definition);
        }

        $this->definitions[$definition::getMimeType()] = $definition;
    }

    /**
     * Adds a content item definition to the collection.
     *
     * @throws UnregisterableDefinitionException
     */
    public function addContentItemDefinition(ContentItemDefinition $definition): void
    {
        if (!is_string($definition::getMimeType())) {
            throw UnregisterableDefinitionException::notAStringMimeType($definition);
        }

        if (!in_array($definition::getMimeType(), ItemType::getList())) {
            throw UnregisterableDefinitionException::unsupportedMimeType($definition);
        }

        if ($this->has($definition::getMimeType())) {
            throw UnregisterableDefinitionException::duplicateMimeType($definition);
        }

        $this->definitions[$definition::getMimeType()] = $definition;
    }

    /**
     * Returns the definition for a specific MIME type, if any.
     *
     * @throws UnregisteredDefinitionException
     */
    public function get(string $type): ItemDefinitionInterface
    {
        if (isset($this->definitions[$type])) {
            return $this->definitions[$type];
        }

        throw new UnregisteredDefinitionException($type, UnregisteredDefinitionException::TARGET_MIME_TYPE);
    }

    /**
     * Checks if a mime-type is supported by the bundle.
     */
    public function has(string $type): bool
    {
        return isset($this->definitions[$type]);
    }

    /**
     * Gets the list of supported item mime-types.
     */
    public function getSupportedTypes(): array
    {
        return array_keys($this->definitions);
    }

    /**
     * Converts mime-type to a supported format.
     */
    public function getConvertedType(string $mimeType): string
    {
        $type = $mimeType;

        if (1 !== preg_match('#^application\/x\.[^/]+\+json$#', $mimeType) && 1 === preg_match('#^[^/]+\/[^/]+$#', $mimeType)) {
            $type = 'content';
        }

        return $type;
    }

    /**
     * Checks if the mime-type is a supported question type.
     */
    public function isQuestionType(string $mimeType): bool
    {
        return (1 === preg_match('#^application\/x\.[^/]+\+json$#', $mimeType)) && $this->has($mimeType);
    }
}
