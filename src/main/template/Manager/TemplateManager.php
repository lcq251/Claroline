<?php

namespace Claroline\TemplateBundle\Manager;

use Claroline\CoreBundle\Manager\LocaleManager;
use Claroline\CoreBundle\Manager\Template\PlaceholderManager;
use Claroline\TempalteBundle\Library\Template\CompiledTemplate;
use Claroline\TemplateBundle\Entity\Template;

class TemplateManager
{
    public function __construct(
        private readonly LocaleManager $localeManager,
        private readonly PlaceholderManager $placeholderManager
    ) {
    }

    public function compile(Template $templateType, ?array $values = [], ?string $locale = null): CompiledTemplate
    {
        $content = null;
        if ($locale) {
            $content = $templateType->getTemplateContent($locale);
        }

        // template for the requested locale does not exist. Try with platform default locale
        $defaultLocale = $this->localeManager->getDefault();
        if (empty($content) && $locale !== $defaultLocale) {
            $content = $templateType->getTemplateContent($defaultLocale);
            $locale = $defaultLocale;
        }

        return new CompiledTemplate(
            $locale,
            $this->placeholderManager->replacePlaceholders($content?->getTitle() ?? '', $values),
            $this->placeholderManager->replacePlaceholders($content?->getContent() ?? '', $values)
        );
    }
}
