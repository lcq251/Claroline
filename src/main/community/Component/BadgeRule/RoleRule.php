<?php

namespace Claroline\CommunityBundle\Component\BadgeRule;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Event\Crud\PatchEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Repository\UserRepository;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Component\BadgeRule\RuleComponent;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class RoleRule extends RuleComponent
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
        return 'in_role';
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::POST_PATCH, User::class) => 'onUserPatch',
            CrudEvents::getEventName(CrudEvents::POST_PATCH, Group::class) => 'onGroupPatch',
            CrudEvents::getEventName(CrudEvents::POST_PATCH, Role::class) => 'onRolePatch',
        ];
    }

    public function getQualifiedUsers(Rule $rule): iterable
    {
        return $this->userRepo->findByRoles([$rule->getRole()]);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_add_role', [
            '%doer%' => $this->tokenStorage->getToken()?->getUser()->getUsername(),
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }

    public function onUserPatch(PatchEvent $event): void
    {
        if (Crud::COLLECTION_ADD === $event->getAction()) {
            $user = $event->getObject();

            $roles = [];
            if ($event->getValue() instanceof Role) {
                $roles[] = $event->getValue();
            } elseif ($event->getValue() instanceof Group) {
                // gets all the roles the user inherits from the new group
                foreach ($event->getValue()->getEntityRoles() as $role) {
                    if (!$user->hasRole($role->getName(), false)) {
                        $roles[] = $role;
                    }
                }
            }

            foreach ($roles as $role) {
                /** @var Rule[] $rules */
                $rules = $this->om->getRepository(Rule::class)->findBy(['role' => $role]);

                foreach ($rules as $rule) {
                    $this->grant($rule, $user);
                }
            }
        }
    }

    public function onRolePatch(PatchEvent $event): void
    {
        if (Crud::COLLECTION_ADD === $event->getAction()) {
            $role = $event->getObject();

            /** @var Rule[] $rules */
            $rules = $this->om->getRepository(Rule::class)->findBy(['role' => $role]);
            if (!empty($rules)) {
                $users = [];
                if ($event->getValue() instanceof User) {
                    $users[] = $event->getValue();
                } elseif ($event->getValue() instanceof Group) {
                    $groupUsers = $this->om->getRepository(User::class)->findByGroup($event->getValue());
                    foreach ($groupUsers as $user) {
                        if (!$user->hasRole($role->getName(), false)) {
                            $users[] = $user;
                        }
                    }
                }

                foreach ($rules as $rule) {
                    foreach ($users as $user) {
                        $this->grant($rule, $user);
                    }
                }
            }
        }
    }

    public function onGroupPatch(PatchEvent $event): void
    {
        if (Crud::COLLECTION_ADD === $event->getAction()) {
            $group = $event->getObject();

            if ($event->getValue() instanceof User) {
                $user = $event->getValue();

                $roles = [];
                foreach ($group->getEntityRoles() as $groupRole) {
                    if (!$event->getValue()->hasRole($groupRole->getName(), false)) {
                        $roles[] = $groupRole;
                    }
                }

                foreach ($roles as $role) {
                    /** @var Rule[] $rules */
                    $rules = $this->om->getRepository(Rule::class)->findBy(['role' => $role]);
                    foreach ($rules as $rule) {
                        $this->grant($rule, $user);
                    }
                }
            } elseif ($event->getValue() instanceof Role) {
                $role = $event->getValue();
                $groupUsers = $this->om->getRepository(User::class)->findByGroup($group);

                $users = [];
                foreach ($groupUsers as $user) {
                    if (!$user->isDisabled() && !$user->isRemoved() && !$user->hasRole($role->getName(), false)) {
                        $users[] = $user;
                    }
                }

                /** @var Rule[] $rules */
                $rules = $this->om->getRepository(Rule::class)->findBy(['role' => $role]);
                foreach ($rules as $rule) {
                    foreach ($users as $user) {
                        $this->grant($rule, $user);
                    }
                }
            }
        }
    }
}
