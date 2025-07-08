<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\AppBundle\Component\AbstractComponentProvider;
use Claroline\CoreBundle\Manager\Template\PlaceholderManager;

/**
 * Aggregates all the templates defined in the Claroline app.
 *
 * A template MUST:
 *   - be declared as a symfony service and tagged with "claroline.component.template".
 *   - implement the TemplateTypeInterface interface.
 */
class TemplateProvider extends AbstractComponentProvider
{
    /**
     * @param iterable|TemplateTypeInterface[] $registeredTemplates
     */
    public function __construct(
        private readonly iterable $registeredTemplates,
        private readonly PlaceholderManager $placeholderManager
    ) {
    }

    final public static function getServiceTag(): string
    {
        return 'claroline.component.template';
    }

    /**
     * Get the list of all the tools injected in the app by the current plugins.
     * It does not contain tools for disabled plugins.
     *
     * @return iterable|TemplateTypeInterface[]
     */
    protected function getRegisteredComponents(): iterable
    {
        return $this->registeredTemplates;
    }

    public function getAvailableTemplates(): array
    {
        $available = [
            TemplateTypeInterface::EMAIL => [],
            TemplateTypeInterface::PDF => [],
            TemplateTypeInterface::OTHER => [],
        ];

        foreach ($this->getRegisteredComponents() as $templateComponent) {
            $available[$templateComponent::getType()][] = [
                'name' => $templateComponent::getName(),
                'type' => $templateComponent::getType(),
                'placeholders' => array_merge(
                    $this->placeholderManager->getAvailablePlaceholders(),
                    $templateComponent->getPlaceholders()
                ),
                'samples' => $templateComponent->getSamples(),
                'system' => $templateComponent->getSystemTemplate(),
            ];
        }

        return $available;
    }

    public function getTemplate(string $templateName): TemplateTypeInterface
    {
        /** @var TemplateTypeInterface $templateHandler */
        $templateHandler = $this->getComponent($templateName);

        return $templateHandler;
    }
}
