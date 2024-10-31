<?php

namespace Claroline\CommunityBundle\Component\Importer\User;

use Claroline\AppBundle\Component\Context\ContextSubjectInterface;
use Claroline\TransferBundle\Component\Importer\ImporterInterface;

class Create implements ImporterInterface
{
    public static function getName(): string
    {
        return 'user_create';
    }

    public function supportsContext(string $context): bool
    {
        // TODO: Implement supportsContext() method.
    }

    public function supportsSubject(ContextSubjectInterface $subject): bool
    {
        return true;
    }

    public function validate(array $data): ?array
    {
        // TODO: Implement validate() method.
    }

    public function execute(array $data): void
    {
        // TODO: Implement execute() method.
    }
}
