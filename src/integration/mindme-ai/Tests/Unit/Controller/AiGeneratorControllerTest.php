<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Tests\Unit\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Controller\AiGeneratorController;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * C-24 T6: the AI call entry refuses expired model resources (403 + message),
 * and lets not-expired / unrestricted resources pass.
 */
class AiGeneratorControllerTest extends MockeryTestCase
{
    private $om;
    private $translator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->om = $this->mock(ObjectManager::class);
        $this->translator = $this->mock(TranslatorInterface::class);
    }

    private function mockDefaultLesson(?AiLesson $lesson): void
    {
        $repo = $this->mock(EntityRepository::class);
        $repo->shouldReceive('findOneBy')->with(['isDefault' => true])->andReturn($lesson);

        $this->om->shouldReceive('getRepository')->with(AiLesson::class)->andReturn($repo);
    }

    private function createController(): AiGeneratorController
    {
        return new AiGeneratorController($this->om, $this->translator);
    }

    public function testExpiredDefaultLessonRefusesCallWith403(): void
    {
        $lesson = new AiLesson();
        $lesson->setExpiresAt(new \DateTime('-1 day'));

        $this->mockDefaultLesson($lesson);
        $this->translator->shouldReceive('trans')
            ->with('ai_lesson_expired', [], 'resource')
            ->andReturn('expired message');

        $response = $this->createController()->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(403, $response->getStatusCode());
        $this->assertSame(['message' => 'expired message'], json_decode($response->getContent(), true));
    }

    public function testNoDefaultLessonAllowsCall(): void
    {
        $this->mockDefaultLesson(null);

        $response = $this->createController()->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
    }

    public function testNotExpiredDefaultLessonAllowsCall(): void
    {
        $lesson = new AiLesson();
        $lesson->setExpiresAt(new \DateTime('+1 day'));

        $this->mockDefaultLesson($lesson);

        $response = $this->createController()->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
    }

    public function testNoExpiryOnDefaultLessonAllowsCall(): void
    {
        $this->mockDefaultLesson(new AiLesson());

        $response = $this->createController()->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
    }
}
