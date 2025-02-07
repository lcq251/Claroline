<?php

namespace UJM\ExoBundle\Library\Validator;

interface ValidatorInterface
{
    public function validate(mixed $data, array $options = []): array;
}
