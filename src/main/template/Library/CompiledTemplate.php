<?php

namespace Claroline\TemplateBundle\Library;

use Claroline\TemplateBundle\Model\TemplateContentInterface;

final readonly class CompiledTemplate implements TemplateContentInterface
{
    public function __construct(
        private string $lang,
        private ?string $title = '',
        private ?string $content = '',
    ) {
    }

    public function getLang(): string
    {
        return $this->lang;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getContent(): string
    {
        return $this->content;
    }
}
