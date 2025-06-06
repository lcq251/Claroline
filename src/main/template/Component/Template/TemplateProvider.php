<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\AppBundle\Component\AbstractComponentProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Manager\LocaleManager;
use Claroline\CoreBundle\Manager\Template\PlaceholderManager;
use Claroline\TemplateBundle\Library\CompiledTemplate;
use Claroline\TemplateBundle\Entity\Template;

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
        private readonly ObjectManager $om,
        private readonly LocaleManager $localeManager,
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

    /**
     * @param string|Template $template - The name of a Template component or a Template entity. If the name of a component is provided we will retrieve the default template for the type
     */
    public function compile(string|Template $template, ?array $values = [], ?string $locale = null): CompiledTemplate
    {
        if (is_string($template)) {
            $template = $this->getDefaultTemplate($template);
        }

        $content = null;
        if ($locale) {
            $content = $template->getTemplateContent($locale);
        }

        // The template for the requested locale does not exist. Try with platform default locale
        $defaultLocale = $this->localeManager->getDefault();
        if (empty($content) && $locale !== $defaultLocale) {
            $content = $template->getTemplateContent($defaultLocale);
            $locale = $defaultLocale;
        }

        return new CompiledTemplate(
            $locale,
            $this->placeholderManager->replacePlaceholders($content?->getTitle() ?? '', $values),
            $this->placeholderManager->replacePlaceholders($content?->getContent() ?? '', $values)
        );
    }

    /**
     * Get the default Template for a type. If none is defined, it fallbacks on the system template defined by the component.
     */
    private function getDefaultTemplate(string $templateType): Template
    {
        $defaultTemplate = $this->om->getRepository(Template::class)->findOneBy([
            'type' => $templateType,
            'default' => true,
        ]);

        if ($defaultTemplate) {
            return $defaultTemplate;
        }

        $component = $this->getTemplate($templateType);

        return $component->getSystemTemplate();
    }

    public function getTemplateInstances(string $templateType): array
    {
        $component = $this->getTemplate($templateType);

        return array_merge([$component->getSystemTemplate()], $this->om->getRepository(Template::class)->findBy(['type' => $templateType]));
    }
}
