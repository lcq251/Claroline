<?php

namespace Claroline\CoreBundle\Listener\Resource;

use Claroline\CoreBundle\Event\Resource\EmbedResourceEvent;
use Claroline\CoreBundle\Event\Resource\ResourceActionEvent;
use Claroline\CoreBundle\Manager\Resource\ResourceLifecycleManager;
use Twig\Environment;

/**
 * @deprecated
 */
class ResourceListener
{
    public function __construct(
        private readonly Environment $templating,
        private readonly ResourceLifecycleManager $lifecycleManager
    ) {
    }

    /**
     * Embed the resource in texts.
     * It will generate a link for most of the resources. Some files (images, videos/audios) are directly rendered.
     */
    public function embed(EmbedResourceEvent $event): void
    {
        $resourceNode = $event->getResourceNode();

        // propagate event to resource type
        $subEvent = $this->lifecycleManager->embed($resourceNode);
        if ($subEvent->isPopulated()) {
            $event->setData($subEvent->getData());
        } else {
            $mimeType = explode('/', $resourceNode->getMimeType());

            $view = 'default';
            if ($mimeType[0] && in_array($mimeType[0], ['video', 'audio', 'image'])) {
                $view = $mimeType[0];
            }

            $event->setData($this->templating->render("@ClarolineCore/resource/embed/{$view}.html.twig", [
                'resource' => $event->getResource(),
            ]));
        }
    }

    public function export(ResourceActionEvent $event): void
    {
        $this->lifecycleManager->export($event->getResourceNode());
    }
}
