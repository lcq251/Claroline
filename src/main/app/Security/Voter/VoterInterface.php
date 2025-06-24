<?php

namespace Claroline\AppBundle\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface as BaseVoterInterface;

interface VoterInterface extends BaseVoterInterface
{
    /** @var string */
    public const OPEN = 'OPEN';
    /** @var string */
    public const CREATE = 'CREATE';
    /** @var string */
    public const FOLLOW = 'FOLLOW';
    /** @var string */
    public const EDIT = 'EDIT';
    /** @var string */
    public const COPY = 'COPY';
    /** @var string */
    public const ADMINISTRATE = 'ADMINISTRATE';
    /** @var string */
    public const DELETE = 'DELETE';
    /** @var string */
    public const PATCH = 'PATCH';

    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options): int;

    public function getClass(): string;

    public function getSupportedActions(): ?array;
}
