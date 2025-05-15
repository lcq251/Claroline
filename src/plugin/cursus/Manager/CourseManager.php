<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Manager;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Manager\PlatformManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\Template\TemplateManager;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Symfony\Contracts\Translation\TranslatorInterface;

class CourseManager
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly SerializerProvider $serializer,
        private readonly FinderProvider $finder,
        private readonly PlatformManager $platformManager,
        private readonly TemplateManager $templateManager
    ) {
    }

    public function generateFromTemplate(Course $course, string $locale): string
    {
        $placeholders = [
            'course_name' => $course->getName(),
            'course_code' => $course->getCode(),
            'course_description' => $course->getDescription(),
            'course_poster' => $course->getPoster() ? '<img src="'.$this->platformManager->getUrl().'/'.$course->getPoster().'" style="max-width: 100%;"/>' : '',
            'course_default_duration' => $course->getDefaultSessionDuration(),
            'course_public_registration' => $this->translator->trans($course->getPublicRegistration() ? 'yes' : 'no', [], 'platform'),
        ];

        return $this->templateManager->getTemplate('training_course', $placeholders, $locale);
    }

    public function getRegistrations(User $user, ?Course $course = null): array
    {
        $search = ['user' => $user->getUuid()];

        if ($course) {
            $search['course'] = $course->getUuid();
        }

        $userRegistrations = $this->finder->fetch(SessionUser::class, $search);

        return array_map(function (SessionUser $sessionUser) {
            return $this->serializer->serialize($sessionUser/* , [SerializerInterface::SERIALIZE_MINIMAL] */);
        }, $userRegistrations);
    }
}
