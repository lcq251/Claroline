<?php

namespace Claroline\CommunityBundle\Transfer\Exporter\User;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Entity\UserProfile;
use Claroline\CoreBundle\Entity\User;
use Claroline\TransferBundle\Transfer\Exporter\AbstractListExporter;

class ListExporter extends AbstractListExporter
{
    public static function getAction(): array
    {
        return ['user', 'list'];
    }

    public function __construct(
        private readonly ObjectManager $om,
    ) {
    }

    public function supports(string $format, ?array $options = [], ?array $extra = []): bool
    {
        return in_array($format, ['json', 'csv']);
    }

    protected static function getClass(): string
    {
        return User::class;
    }

    public function getSchema(?array $options = [], ?array $extra = []): array
    {
        $availableFields = [
            'properties' => [
                [
                    'name' => 'id',
                    'type' => 'string',
                    'description' => $this->translator->trans('The user id', [], 'schema'),
                ], [
                    'name' => 'email',
                    'type' => 'string',
                    'description' => $this->translator->trans('The user email address', [], 'schema'),
                ], [
                    'name' => 'username',
                    'type' => 'string',
                    'description' => $this->translator->trans('The user username', [], 'schema'),
                ], [
                    'name' => 'firstName',
                    'type' => 'string',
                    'description' => $this->translator->trans('The user first name', [], 'schema'),
                ], [
                    'name' => 'lastName',
                    'type' => 'string',
                    'description' => $this->translator->trans('The user last name', [], 'schema'),
                ], [
                    'name' => 'administrativeCode',
                    'type' => 'string',
                    'description' => $this->translator->trans('The user administrativeCode', [], 'schema'),
                ], [
                    'name' => 'meta.description',
                    'type' => 'string',
                    'description' => $this->translator->trans('The user description', [], 'schema'),
                ], [
                    'name' => 'meta.created',
                    'type' => 'date',
                    'description' => $this->translator->trans('The user creation date', [], 'schema'),
                ], [
                    'name' => 'lastActivity',
                    'type' => 'date',
                    'description' => $this->translator->trans('The user last activity date', [], 'schema'),
                ], [
                    'name' => 'restrictions.disabled',
                    'type' => 'boolean',
                    'description' => $this->translator->trans('Is the user disabled ?', [], 'schema'),
                ], [
                    'name' => 'restrictions.dates',
                    'type' => 'date-range',
                    'description' => $this->translator->trans('The user restriction dates', [], 'schema'),
                ],
            ],
        ];

        $userProfiles = $this->om->getRepository(UserProfile::class)->findAll();
        if (empty($userProfiles)) {
            return $userProfiles;
        }

        // find facet fields to expose them to export
        $userProfile = $userProfiles[0];

        foreach ($userProfile->getSections() as $section) {
            foreach ($section->getFields() as $field) {
                $availableFields['properties'][] = [
                    'name' => $field->getAlias() ? "profile.{$field->getUuid()}" : "profile.$field->getUuid()",
                    'type' => $field->getType(),
                    'label' => $field->getLabel(),
                    'description' => $field->getLabel(),
                ];
            }
        }

        return $availableFields;
    }

    protected function getAvailableFilters(): array
    {
        return [
            [
                'name' => 'email',
                'type' => 'string',
                'label' => $this->translator->trans('email', [], 'platform'),
            ], [
                'name' => 'username',
                'type' => 'string',
                'label' => $this->translator->trans('username', [], 'platform'),
            ], [
                'name' => 'restrictions.disabled',
                'type' => 'boolean',
                'label' => $this->translator->trans('disabled', [], 'platform'),
                'alias' => 'disabled',
            ],
        ];
    }

    protected function getAvailableSortBy(): array
    {
        return [
            [
                'name' => 'name',
                'label' => $this->translator->trans('name', [], 'platform'),
            ], [
                'name' => 'email',
                'label' => $this->translator->trans('email', [], 'platform'),
            ], [
                'name' => 'username',
                'label' => $this->translator->trans('username', [], 'platform'),
            ], [
                'name' => 'firstName',
                'label' => $this->translator->trans('first_name', [], 'platform'),
            ], [
                'name' => 'lastName',
                'label' => $this->translator->trans('last_name', [], 'platform'),
            ],
        ];
    }
}
