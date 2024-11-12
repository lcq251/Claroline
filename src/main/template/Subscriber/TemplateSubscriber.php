<?php

namespace Claroline\TemplateBundle\Subscriber;

use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\TemplateBundle\Entity\Template;
use Claroline\AppBundle\Event\CrudEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class TemplateSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ObjectManager $om
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::PRE_UPDATE, Template::class) => 'preUpdate',
        ];
    }

    public function preUpdate(UpdateEvent $event): void
    {
        /** @var Template $template */
        $template = $event->getObject();
        $oldData = $event->getOldData();

        if ($template->isDefault() && !$oldData['default']) {
            // replace old default
            $oldDefault = $this->om->getRepository(Template::class)->findOneBy([
                'type' => $template->getType(),
                'default' => true,
            ]);

            if ($oldDefault) {
                $oldDefault->setDefault(false);
                $this->om->persist($oldDefault);
            }
        }
    }
}
