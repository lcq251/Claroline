<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Template;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\TemplateBundle\Entity\Template;
use Claroline\CoreBundle\Manager\LocaleManager;
use Doctrine\Persistence\ObjectRepository;

class TemplateManager
{
    private ObjectRepository $templateRepo;

    public function __construct(
        ObjectManager $om,
        private readonly LocaleManager $localeManager,
        private readonly PlaceholderManager $placeholderManager
    ) {
        $this->templateRepo = $om->getRepository(Template::class);
    }

    public function getTemplate(string $templateType, array $placeholders = [], string $locale = null, string $mode = 'content'): string
    {
        /** @var Template $template */
        $template = $this->templateRepo->findOneBy([
            'type' => $templateType,
            'default' => true,
        ]);

        if ($template) {
            if (!$locale) {
                $locale = $this->localeManager->getDefault();
            }

            return $this->getTemplateContent($template, $placeholders, $locale, $mode);
        }

        return '';
    }

    public function getTemplateContent(Template $template, array $placeholders = [], string $locale = null, string $mode = 'content'): string
    {
        $content = null;
        if ($locale) {
            $content = $template->getTemplateContent($locale);
        }

        // content for the requested locale does not exist. Try with platform default locale
        $defaultLocale = $this->localeManager->getDefault();
        if (empty($content) && $locale !== $defaultLocale) {
            $content = $template->getTemplateContent($defaultLocale);
        }

        if ($content) {
            switch ($mode) {
                case 'content':
                    return $this->placeholderManager->replacePlaceholders($content->getContent() ?? '', $placeholders);
                case 'title':
                    return $this->placeholderManager->replacePlaceholders($content->getTitle() ?? '', $placeholders);
            }
        }

        return '';
    }

    public function formatDatePlaceholder(string $placeholderPrefix, ?\DateTime $date): array
    {
        return $this->placeholderManager->formatDatePlaceholder($placeholderPrefix, $date);
    }
}
