<?php

namespace Claroline\AppBundle\API\Utils;

class FileBag
{
    private array $files = [];

    public function add(string $newPath, string $location): void
    {
        $this->files[$newPath] = $location;
    }

    public function all(): array
    {
        return $this->files;
    }

    public function get(string $key): ?string
    {
        // be sure to use unix directory separator
        $key = str_replace('\\', '/', $key);

        if (!empty($this->files[$key])) {
            return $this->files[$key];
        }

        return null;
    }
}
