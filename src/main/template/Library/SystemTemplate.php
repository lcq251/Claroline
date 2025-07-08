<?php

namespace Claroline\TemplateBundle\Library;

use Claroline\TemplateBundle\Model\TemplateContentInterface;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class SystemTemplate implements \JsonSerializable, TemplateInterface
{
    private array $contents = [];

    public function getTemplateContent(string $lang): ?TemplateContentInterface
    {
        return $this->contents[$lang];
    }

    public function addTemplateContent(string $lang, string $title, string $content): self
    {
        $this->contents[$lang] = new SystemTemplateContent($lang, $title, $content);

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'name' => 'system',
            'system' => true,
            'contents' => array_map(function (TemplateContentInterface $content) {
                return [
                    'lang' => $content->getLang(),
                    'title' => $content->getTitle(),
                    'content' => $content->getContent(),
                ];
            }, $this->contents),
        ];
    }
}
