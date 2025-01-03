<?php

namespace Claroline\TagBundle\Validator;

use Claroline\AppBundle\API\ValidatorInterface;
use Claroline\TagBundle\Entity\Tag;

class TagValidator implements ValidatorInterface
{
    public function validate(array $data, string $mode, array $options = []): array
    {
        return [];
    }

    public function getUniqueFields(): array
    {
        return [
            'name' => 'name',
        ];
    }

    public static function getClass(): string
    {
        return Tag::class;
    }
}
