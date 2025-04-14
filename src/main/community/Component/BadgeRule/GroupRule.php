<?php

namespace Claroline\CommunityBundle\Component\BadgeRule;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Event\Crud\PatchEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Repository\UserRepository;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Component\BadgeRule\RuleComponent;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class GroupRule extends RuleComponent
{
    private UserRepository $userRepo;

    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om
    ) {
        $this->userRepo = $om->getRepository(User::class);
    }

    public static function getName(): string
    {
        return 'in_group';
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::POST_PATCH, User::class) => 'onUserPatch',
            CrudEvents::getEventName(CrudEvents::POST_PATCH, Group::class) => 'onGroupPatch',
        ];
    }

    public function getQualifiedUsers(Rule $rule): iterable
    {
        return $this->userRepo->findByGroup($rule->getGroup());
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_add_group', [
            '%doer%' => $this->tokenStorage->getToken()?->getUser()->getUsername(),
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }

    public function onUserPatch(PatchEvent $event): void
    {
        if (Crud::COLLECTION_ADD === $event->getAction() && 'group' === $event->getProperty()) {
            /** @var Rule[] $rules */
            $rules = $this->om->getRepository(Rule::class)->findBy(['group' => $event->getValue()]);

            foreach ($rules as $rule) {
                $this->grant($rule, $event->getObject());
            }
        }
    }

    public function onGroupPatch(PatchEvent $event): void
    {
        if (Crud::COLLECTION_ADD === $event->getAction() && 'user' === $event->getProperty()) {
            /** @var Rule[] $rules */
            $rules = $this->om->getRepository(Rule::class)->findBy(['group' => $event->getObject()]);

            foreach ($rules as $rule) {
                $this->grant($rule, $event->getValue());
            }
        }
    }
}
