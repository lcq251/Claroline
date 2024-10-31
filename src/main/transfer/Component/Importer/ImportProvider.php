<?php

namespace Claroline\TransferBundle\Component\Importer;

use Claroline\AppBundle\Component\AbstractComponentProvider;
use Claroline\AppBundle\Component\Context\ContextSubjectInterface;

/**
 * Aggregates all the importers defined in the Claroline app.
 *
 * An importer MUST :
 *   - be declared as a symfony service and tagged with "claroline.component.importer".
 *   - implement the ImporterInterface interface (or the AbstractImporter class).
 */
final class ImportProvider extends AbstractComponentProvider
{
    public function __construct(
        private readonly iterable $registeredImporters
    ) {
    }

    final public static function getServiceTag(): string
    {
        return 'claroline.component.importer';
    }

    /**
     * Get the list of all the importers injected in the app by the current plugins.
     * It does not contain contexts for disabled plugins.
     */
    protected function getRegisteredComponents(): iterable
    {
        return $this->registeredImporters;
    }

    /**
     * Get the list of all implemented importers for a context.
     * It contains the importers from all the enabled plugins.
     */
    public function getAvailableImporters(string $context, ?ContextSubjectInterface $contextSubject = null): array
    {
        $available = [];
        foreach ($this->getRegisteredComponents() as $component) {
            if ($component->supportsContext($context) && (empty($contextSubject) || $component->supportsSubject($contextSubject))) {
                $available[] = $component;
            }
        }

        return $available;
    }
}
