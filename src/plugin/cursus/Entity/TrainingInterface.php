<?php

namespace Claroline\CursusBundle\Entity;

interface TrainingInterface
{
    /**
     * Users are automatically registered when opening the linked Workspace.
     */
    public function getAutoRegistration(): bool;

    /**
     * Users can register themselves though the training catalog.
     */
    public function getPublicRegistration(): bool;

    /**
     * Users can unregister themselves from their trainings.
     */
    public function getPublicUnregistration(): bool;

    /**
     * A manager must validate registrations before users are fully registered to the training.
     */
    public function hasValidation(): bool;

    /**
     * Email users when they are registered to the training.
     */
    public function getRegistrationMail(): bool;

    /**
     * The registered user must confirm is registration in order to be fully registered to the training.
     */
    public function hasConfirmation(): bool;

    public function getPendingRegistrations(): bool;
}
