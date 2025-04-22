<?php

namespace Claroline\CommunityBundle\Component\BadgeRule;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Event\Crud\PatchEvent;
use Claroline\AppBundle\Event\CrudEvents;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Entity\Team;
use Claroline\CommunityBundle\Repository\UserRepository;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Component\BadgeRule\RuleComponent;
use Claroline\OpenBadgeBundle\Entity\Rule;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class TeamRule extends RuleComponent
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
        return 'in_team';
    }

    public function supportsContext(string $context): bool
    {
        return WorkspaceContext::getName() === $context;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudEvents::getEventName(CrudEvents::POST_PATCH, Team::class) => 'onUserPatch',
        ];
    }

    public function getQualifiedUsers(Rule $rule, ?object $subject = null): iterable
    {
        if (empty($subject)) {
            return [];
        }

        return $this->userRepo->findByTeam($subject);
    }

    public function getEvidenceMessage(): string
    {
        $now = new \DateTime();

        return $this->translator->trans('evidence_narrative_add_team', [
            '%doer%' => $this->tokenStorage->getToken()?->getUser()->getUsername(),
            '%date%' => $now->format('Y-m-d H:i:s'),
        ], 'badge');
    }

    public function onUserPatch(PatchEvent $event): void
    {
        if (Crud::COLLECTION_ADD === $event->getAction()) {
            $team = $event->getObject();

            if ($event->getValue() instanceof User) {
                $rules = $this->om->getRepository(Rule::class)->findBy(['subjectId' => $team->getUuid()]);
                foreach ($rules as $rule) {
                    $this->grant($rule, $event->getValue());
                }
            }
        }
    }
}
