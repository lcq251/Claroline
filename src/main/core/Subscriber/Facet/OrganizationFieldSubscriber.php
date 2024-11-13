<?php

namespace Claroline\CoreBundle\Subscriber\Facet;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\CatalogEvents\FacetEvents;
use Claroline\CoreBundle\Event\Facet\GetFacetValueEvent;
use Claroline\CoreBundle\Event\Facet\SetFacetValueEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class OrganizationFieldSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            FacetEvents::getEventName(FacetEvents::GET_VALUE, 'organization') => 'getValue',
            FacetEvents::getEventName(FacetEvents::SET_VALUE, 'organization') => 'setValue',
        ];
    }

    /**
     * Retrieve and serialize Organization using the stored ID.
     */
    public function getValue(GetFacetValueEvent $event): void
    {
        $organizationId = $event->getValue();
        if (!empty($organizationId)) {
            $organization = $this->om->getRepository(Organization::class)->findOneBy(['uuid' => $organizationId]);

            if ($organization) {
                $event->setFormattedValue(
                    $this->serializer->serialize($organization, [Options::SERIALIZE_MINIMAL])
                );
            }
        }

        $event->stopPropagation();
    }

    /**
     * Grab Organization ID from the organization data received from the api to store it.
     */
    public function setValue(SetFacetValueEvent $event): void
    {
        $organizationData = $event->getValue();
        if (!empty($organizationData) && !empty($organizationData['id'])) {
            // only store the id in DB
            $event->setFormattedValue($organizationData['id']);

            // For profile only, register user to the selected organization to give him proper rights
            if ($event->getObject() instanceof User) {
                $organization = $this->om->getRepository(Organization::class)->findOneBy(['uuid' => $organizationData['id']]);
                if ($organization) {
                    $event->getObject()->addOrganization($organization);
                }
            }
        }

        $event->stopPropagation();
    }
}
