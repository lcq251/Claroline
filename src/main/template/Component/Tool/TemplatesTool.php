<?php

namespace Claroline\TemplateBundle\Component\Tool;

use Claroline\AppBundle\Component\Context\ContextSubjectInterface;
use Claroline\AppBundle\Component\Tool\AbstractTool;
use Claroline\CoreBundle\Component\Context\AdministrationContext;
use Claroline\TemplateBundle\Component\Template\TemplateProvider;

class TemplatesTool extends AbstractTool
{
    public function __construct(
        private readonly TemplateProvider $templateProvider
    ) {
    }

    public static function getName(): string
    {
        return 'templates';
    }

    public static function getIcon(): string
    {
        return 'stamp';
    }

    public function supportsContext(string $context): bool
    {
        return AdministrationContext::getName() === $context;
    }

    public function isRequired(string $context, ContextSubjectInterface $contextSubject = null): bool
    {
        return true;
    }

    public function open(string $context, ContextSubjectInterface $contextSubject = null): ?array
    {
        return [
            'templateTypes' => $this->templateProvider->getAvailableTemplates(),
        ];
    }
}
