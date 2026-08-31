<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\MarkdownBundle\Subscriber;

use Claroline\AppBundle\Event\Client\InjectJavascriptEvent;
use Claroline\AppBundle\Event\ClientEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Twig\Environment;

class PluginSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly Environment $templating
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ClientEvents::JAVASCRIPTS => 'onInjectJs',
        ];
    }

    public function onInjectJs(InjectJavascriptEvent $event): void
    {
        $event->addContent(
            $this->templating->render('@MindmeMarkdown/scripts.html.twig')
        );
    }
}