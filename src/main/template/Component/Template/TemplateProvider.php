<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\AppBundle\Component\AbstractComponentProvider;

/**
 * Aggregates all the templates defined in the Claroline app.
 *
 * A template MUST :
 *   - be declared as a symfony service and tagged with "claroline.component.template".
 *   - implement the TemplateInterface interface (or the AbstractTemplate class in most cases).
 */
final class TemplateProvider extends AbstractComponentProvider
{
    /**
     * @param iterable|TemplateInterface[] $registeredTemplates
     */
    public function __construct(
        private readonly iterable $registeredTemplates
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
     * @return iterable|TemplateInterface[]
     */
    protected function getRegisteredComponents(): iterable
    {
        return $this->registeredTemplates;
    }

    public function getAvailableTemplates(): array
    {
        $available = [
            TemplateInterface::EMAIL => [],
            TemplateInterface::PDF => [],
            TemplateInterface::OTHER => [],
        ];

        foreach ($this->getRegisteredComponents() as $templateComponent) {
            $available[$templateComponent::getType()][] = $templateComponent::getName();
        }

        return $available;
    }

    public function getTemplate(string $templateName): TemplateInterface
    {
        /** @var TemplateInterface $templateHandler */
        $templateHandler = $this->getComponent($templateName);

        return $templateHandler;
    }
}
