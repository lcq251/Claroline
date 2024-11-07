<?php

namespace Claroline\CursusBundle\Entity\Registration;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\MappedSuperclass]
abstract class AbstractRegistration
{
    use Id;
    use Uuid;

    public const TUTOR = 'tutor';
    public const LEARNER = 'learner';

    #[ORM\Column(name: 'registration_type')]
    protected string $type = self::LEARNER;

    #[ORM\Column(name: 'registration_date', type: Types::DATETIME_MUTABLE)]
    protected \DateTimeInterface $date;

    public function __construct()
    {
        $this->refreshUuid();

        $this->date = new \DateTime();
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): void
    {
        $this->type = $type;
    }

    public function getDate(): \DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): void
    {
        $this->date = $date;
    }
}
