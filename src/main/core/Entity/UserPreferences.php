<?php

namespace Claroline\AppBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\CoreBundle\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table('claro_user_preferences')]
class UserPreferences
{
    use Id;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(unique: true, nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    /**
     * A short string representing the preference type (e.g. theme, intl).
     */
    #[ORM\Column()]
    private string $type;

    #[ORM\Column(type: Types::JSON)]
    private ?array $parameters = [];

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getParameters(): ?array
    {
        return $this->parameters;
    }

    public function getParameter(string $parameterName): mixed
    {
        return $this->parameters[$parameterName];
    }

    public function setParameters(array $parameters): void
    {
        $this->parameters = $parameters;
    }

    public function setParameter(string $parameterName, mixed $parametersValue): void
    {
        $this->parameters[$parameterName] = $parametersValue;
    }
}
