<?php

namespace Claroline\TempalteBundle\Library\Template;

final readonly class CompiledTemplate
{
    public function __construct(
        private string $lang = '',
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
