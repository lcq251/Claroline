<?php

namespace Claroline\AppBundle\Component\Context;

abstract class ContextComponent implements ContextInterface
{
    public function getAdditionalData(?ContextSubjectInterface $contextSubject): array
    {
        return [];
    }

    public function create(array $data): void
    {
    }
}
