<?php

namespace Claroline\TemplateBundle\Model;

interface TemplateContentInterface
{
    public function getLang(): string;

    public function getTitle(): ?string;

    public function getContent(): ?string;
}
