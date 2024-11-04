<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\Parser;

/**
 * Parses ini files.
 *
 * @todo : consider using YAML to avoid having to support additional format
 */
class IniParser
{
    public static function dump(array $parameters): string
    {
        $content = '';

        foreach ($parameters as $key => $value) {
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }
            $content .= "{$key} = {$value}\n";
        }

        return $content;
    }

    public static function dumpFile(array $parameters, string $iniFile): void
    {
        $content = static::dump($parameters);

        if (!file_put_contents($iniFile, $content)) {
            throw new \Exception("The claroline cache couldn't be created");
        }
    }

    public static function updateKey($key, $value, $iniFile): void
    {
        $values = static::parseFile($iniFile);
        $values[$key] = $value;

        static::dumpFile($values, $iniFile);
    }

    public static function parse(string $iniString): array
    {
        $values = parse_ini_string($iniString);
        if (!empty($values)) {
            foreach ($values as &$value) {
                $value = (bool) $value ? true : false;
            }

            return $values;
        }

        return [];
    }

    public static function parseFile(string $iniFile): array
    {
        if (file_exists($iniFile)) {
            return static::parse(file_get_contents($iniFile));
        }

        return [];
    }
}
