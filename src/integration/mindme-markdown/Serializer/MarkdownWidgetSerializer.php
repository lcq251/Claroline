<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MarkdownBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Mindme\MarkdownBundle\Entity\Widget\MarkdownWidget;

class MarkdownWidgetSerializer
{
    use SerializerTrait;

    public function getClass(): string
    {
        return MarkdownWidget::class;
    }

    public function getName(): string
    {
        return 'mindme_markdown_widget';
    }

    public function serialize(MarkdownWidget $widget, array $options = []): array
    {
        return [
            'content' => $widget->getContent() ?? '',
        ];
    }

    public function deserialize($data, MarkdownWidget $widget, array $options = []): MarkdownWidget
    {
        $this->sipe('content', 'setContent', $data, $widget);

        return $widget;
    }
}