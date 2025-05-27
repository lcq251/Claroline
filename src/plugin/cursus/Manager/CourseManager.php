<?php

namespace Claroline\CursusBundle\Manager;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Manager\PlatformManager;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\Template\TemplateManager;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Symfony\Contracts\Translation\TranslatorInterface;

class CourseManager
{
    public function __construct(
        private readonly TranslatorInterface $translator,
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer,
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
        $search = ['user' => $user];

        if ($course) {
            $search['course'] = $course;
        }

        $userRegistrations = $this->om->getRepository(SessionUser::class)->findBy($search);

        return array_map(function (SessionUser $sessionUser) {
            return $this->serializer->serialize($sessionUser);
        }, $userRegistrations);
    }
}
