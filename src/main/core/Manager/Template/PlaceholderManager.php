<?php

namespace Claroline\CoreBundle\Manager\Template;

use Claroline\AppBundle\Manager\PlatformManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\LocaleManager;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class PlaceholderManager
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly PlatformConfigurationHandler $config,
        private readonly PlatformManager $platformManager,
        private readonly LocaleManager $localeManager
    ) {
    }

    public function getAvailablePlaceholders(): array
    {
        return [
            'platform_name',
            'platform_secondary_name',
            'platform_url',
            'platform_logo',

            'date',
            'datetime',
            'current_user_id',
            'current_user_username',
            'current_user_first_name',
            'current_user_last_name',
            'current_user_email',
            'current_user_avatar',
        ];
    }

    public function replacePlaceholders(string $text, array $customPlaceholders = []): string
    {
        if (empty($text)) {
            return $text;
        }

        $now = new \DateTime();

        /** @var User|null $currentUser */
        $currentUser = null;
        if ($this->tokenStorage->getToken() && $this->tokenStorage->getToken()?->getUser() instanceof User) {
            $currentUser = $this->tokenStorage->getToken()?->getUser();
        }

        $placeholders = [
            '%platform_name%' => $this->config->getParameter('display.name'),
            '%platform_secondary_name%' => $this->config->getParameter('secondary_name'),
            '%platform_url%' => $this->platformManager->getUrl(),
            '%platform_logo%' => $this->config->getParameter('logo'),

            '%date%' => $now->format('Y-m-d'), // should be in locale format
            '%datetime%' => $now->format('Y-m-d H:i:s'), // should be in locale format
            '%current_user_id%' => $currentUser?->getUuid(),
            '%current_user_username%' => $currentUser?->getUsername(),
            '%current_user_first_name%' => $currentUser?->getFirstName(),
            '%current_user_last_name%' => $currentUser?->getLastName(),
            '%current_user_email%' => $currentUser?->getEmail(),
            '%current_user_avatar%' => $currentUser?->getPicture(),
        ];

        foreach ($customPlaceholders as $key => $value) {
            $placeholders['%'.$key.'%'] = $value;
        }

        return str_replace(array_keys($placeholders), array_values($placeholders), $text);
    }

    public function formatDatePlaceholder(string $placeholderPrefix, ?\DateTime $date): array
    {
        if (empty($date)) {
            return [
                "{$placeholderPrefix}_datetime_utc" => '',
                "{$placeholderPrefix}_date_utc" => '',
                "{$placeholderPrefix}_time_utc" => '',
                "{$placeholderPrefix}_datetime" => '',
                "{$placeholderPrefix}_date" => '',
                "{$placeholderPrefix}_time" => '',
            ];
        }

        $localeDate = $this->localeManager->getLocaleDate($date);
        $dateFormat = $this->config->getParameter('intl.dateFormat') ?: 'Y-m-d';
        $timeFormat = $this->config->getParameter('intl.timeFormat') ?: 'H:i';

        return [
            // UTC date parts
            "{$placeholderPrefix}_datetime_utc" => $date->format($dateFormat.' '.$timeFormat),
            "{$placeholderPrefix}_date_utc" => $date->format($dateFormat),
            "{$placeholderPrefix}_time_utc" => $date->format($timeFormat),
            // Localized date parts
            "{$placeholderPrefix}_datetime" => $localeDate->format($dateFormat.' '.$timeFormat),
            "{$placeholderPrefix}_date" => $localeDate->format($dateFormat),
            "{$placeholderPrefix}_time" => $localeDate->format($timeFormat),
        ];
    }
}
