<?php

namespace Claroline\MindMeAiBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'claro_mindme_ai_lesson')]
class AiLesson extends AbstractResource
{
    /** AI 生成的内容（JSON：包含标题、讲义、习题、答案等） */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $content = null;

    /** 生成参数（JSON：subject, grade, difficulty, module 等） */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $generationParams = null;

    /** 原始 Markdown */
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $rawMarkdown = null;

    public function getContent(): ?array
    {
        return $this->content;
    }

    public function setContent(?array $content): void
    {
        $this->content = $content;
    }

    public function getGenerationParams(): ?array
    {
        return $this->generationParams;
    }

    public function setGenerationParams(?array $params): void
    {
        $this->generationParams = $params;
    }

    public function getRawMarkdown(): ?string
    {
        return $this->rawMarkdown;
    }

    public function setRawMarkdown(?string $markdown): void
    {
        $this->rawMarkdown = $markdown;
    }
}
