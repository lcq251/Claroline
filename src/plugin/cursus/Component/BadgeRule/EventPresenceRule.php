<?php

namespace Claroline\CursusBundle\Component\BadgeRule;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CursusBundle\Entity\EventPresence;
use Claroline\OpenBadgeBundle\Component\BadgeRule\RuleComponent;
use Claroline\OpenBadgeBundle\Entity\Rule;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Grant when a user has been present to an event.
 */
class EventPresenceRule extends RuleComponent
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om
    ) {
    }

    public static function getName(): string
    {
        return 'training_event_presence';
    }

    public function supportsContext(string $context): bool
    {
        return DesktopContext::getName() === $context;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::POST_CREATE, EventPresence::class) => 'onPresenceCreate',
            CrudEvents::getEventName(CrudEvents::POST_UPDATE, EventPresence::class) => 'onPresenceUpdate',
        ];
    }

    public function getQualifiedUsers(Rule $rule, ?object $subject = null): iterable
    {
        if (empty($subject)) {
            return [];
        }

        $presences = $this->om->getRepository(EventPresence::class)->findBy([
            'event' => $subject,
            'status' => EventPresence::PRESENT,
        ]);

        return array_map(static function (EventPresence $presence) {
            return $presence->getUser();
        }, $presences);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_training_presence', [
            '%doer%' => $this->tokenStorage->getToken()?->getUser()->getUsername(),
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }

    public function onPresenceCreate(CreateEvent $event): void
    {
        /** @var EventPresence $presence */
        $presence = $event->getObject();

        if (EventPresence::PRESENT === $presence->getStatus()) {
            /** @var Rule[] $rules */
            $rules = $this->om->getRepository(Rule::class)->findBy(['subjectId' => $presence->getEvent()->getUuid()]);

            foreach ($rules as $rule) {
                $this->grant($rule, $presence->getUser());
            }
        }
    }

    public function onPresenceUpdate(UpdateEvent $event): void
    {
        /** @var EventPresence $presence */
        $presence = $event->getObject();
        $oldData = $event->getOldData();

        if ($oldData['status'] !== $presence->getStatus() && EventPresence::PRESENT === $presence->getStatus()) {
            /** @var Rule[] $rules */
            $rules = $this->om->getRepository(Rule::class)->findBy(['subjectId' => $presence->getEvent()->getUuid()]);

            foreach ($rules as $rule) {
                $this->grant($rule, $presence->getUser());
            }
        }
    }
}
