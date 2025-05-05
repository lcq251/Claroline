<?php

namespace Claroline\TemplateBundle\Model;

interface TemplateInterface
{
    public function getTemplateContent(string $lang): ?TemplateContentInterface;
}
