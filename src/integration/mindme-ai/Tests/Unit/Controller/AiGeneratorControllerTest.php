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
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\MindMeAiBundle\Controller\AiGeneratorController;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Entity\AiLessonUsage;
use Claroline\MindMeAiBundle\Security\SecretCipher;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * C-24 T6 + C-25 (v2): the AI call entry refuses expired model resources and
 * enforces the per-user x per-resource daily trial quota (logged-in users only).
 *
 * The real DeepSeek HTTP call is stubbed by overriding the protected
 * callDeepSeek() in an anonymous subclass — success = non-empty raw content,
 * failure = '' (same contract as the production key-file lookup).
 */
class AiGeneratorControllerTest extends MockeryTestCase
{
    private $om;
    private $translator;
    private $tokenStorage;
    private $config;
    private $cipher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->om = $this->mock(ObjectManager::class);
        $this->translator = $this->mock(TranslatorInterface::class);
        $this->tokenStorage = $this->mock(TokenStorageInterface::class);
        $this->config = $this->mock(PlatformConfigurationHandler::class);
        $this->cipher = $this->mock(SecretCipher::class);
    }

    private function mockDefaultLesson(?AiLesson $lesson): void
    {
        $repo = $this->mock(EntityRepository::class);
        $repo->shouldReceive('findOneBy')->with(['isDefault' => true])->andReturn($lesson);

        $this->om->shouldReceive('getRepository')->with(AiLesson::class)->andReturn($repo);
    }

    private function mockUsageRepository(?AiLessonUsage $usage, callable $capture = null): void
    {
        $repo = $this->mock(EntityRepository::class);
        $matcher = ['userId' => 1, 'aiLessonId' => 5, 'periodDate' => new \DateTime('today')];

        if (null === $capture) {
            $repo->shouldReceive('findOneBy')->with($matcher)->andReturn($usage);
        } else {
            $repo->shouldReceive('findOneBy')->with(\Mockery::on(function (array $criteria) use ($matcher, $capture) {
                $capture($criteria);

                return $criteria == $matcher;
            }))->andReturn($usage);
        }

        $this->om->shouldReceive('getRepository')->with(AiLessonUsage::class)->andReturn($repo);
    }

    private function mockLesson(int $id, ?int $usageLimit): AiLesson
    {
        $lesson = $this->mock(AiLesson::class);
        $lesson->shouldReceive('getId')->andReturn($id);
        $lesson->shouldReceive('getUsageLimit')->andReturn($usageLimit);
        $lesson->shouldReceive('isExpired')->andReturn(false);

        return $lesson;
    }

    private function mockUser(int $id): User
    {
        $user = $this->mock(User::class);
        $user->shouldReceive('getId')->andReturn($id);

        return $user;
    }

    private function mockLoggedIn(User $user): void
    {
        $token = $this->mock(TokenInterface::class);
        $token->shouldReceive('getUser')->andReturn($user);

        $this->tokenStorage->shouldReceive('getToken')->andReturn($token);
    }

    private function mockAnonymous(): void
    {
        $this->tokenStorage->shouldReceive('getToken')->andReturn(null);
    }

    private function mockQuotaMessage(): void
    {
        $this->translator->shouldReceive('trans')
            ->with('ai_lesson_quota_exceeded', [], 'resource')
            ->andReturn('quota exceeded message');
    }

    /**
     * Controller whose protected callDeepSeek() is stubbed (success = non-empty,
     * failure = '' — same contract as the production key-file lookup).
     */
    private function createController(string $aiResponse = ''): AiGeneratorController
    {
        return new class($this->om, $this->translator, $this->tokenStorage, $this->config, $this->cipher, $aiResponse) extends AiGeneratorController {
            private string $aiResponse;

            public function __construct(
                ObjectManager $om,
                TranslatorInterface $translator,
                TokenStorageInterface $tokenStorage,
                PlatformConfigurationHandler $config,
                SecretCipher $cipher,
                string $aiResponse
            ) {
                parent::__construct($om, $translator, $tokenStorage, $config, $cipher);
                $this->aiResponse = $aiResponse;
            }

            protected function callDeepSeek(string $prompt): string
            {
                return $this->aiResponse;
            }
        };
    }

    // ------------------------------------------------------------------
    // C-24 T6: expiry guard
    // ------------------------------------------------------------------

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
        $this->mockAnonymous();

        $response = $this->createController()->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
    }

    public function testNotExpiredDefaultLessonAllowsCall(): void
    {
        $lesson = new AiLesson();
        $lesson->setExpiresAt(new \DateTime('+1 day'));

        $this->mockDefaultLesson($lesson);
        $this->mockAnonymous();

        $response = $this->createController()->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
    }

    public function testNoExpiryOnDefaultLessonAllowsCall(): void
    {
        $this->mockDefaultLesson(new AiLesson());
        $this->mockAnonymous();

        $response = $this->createController()->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
    }

    // ------------------------------------------------------------------
    // C-25 v2: daily trial quota (logged-in user x default resource x today)
    // ------------------------------------------------------------------

    public function testNewUserWithinQuotaCreatesRowAndCountsSuccess(): void
    {
        $this->mockDefaultLesson($this->mockLesson(5, 20));
        $this->mockLoggedIn($this->mockUser(1));
        $this->mockUsageRepository(null);

        $captured = null;
        $this->om->shouldReceive('persist')->once()->with(\Mockery::on(function ($entity) use (&$captured) {
            $captured = $entity;

            return $entity instanceof AiLessonUsage;
        }));
        $this->om->shouldReceive('flush')->once();

        $response = $this->createController('{"title":"AI 课","sections":[{"title":"s","body":"b"}]}')
            ->generate(new Request([], [], [], [], [], [], '{"topic":"函数"}'));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertInstanceOf(AiLessonUsage::class, $captured);
        $this->assertSame(1, $captured->getUserId());
        $this->assertSame(5, $captured->getAiLessonId());
        $this->assertSame(1, $captured->getCount());
        $this->assertSame(20, $captured->getLimit());
        $this->assertEquals(new \DateTime('today'), $captured->getPeriodDate());
    }

    public function testQuotaExceededRefusesCallWith403(): void
    {
        $this->mockDefaultLesson($this->mockLesson(5, 3));
        $this->mockLoggedIn($this->mockUser(1));

        $usage = new AiLessonUsage();
        $usage->setCount(3);
        $usage->setLimit(3);
        $this->mockUsageRepository($usage);
        $this->mockQuotaMessage();

        $this->om->shouldNotReceive('persist');
        $this->om->shouldNotReceive('flush');

        $response = $this->createController('{"title":"unused"}')->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(403, $response->getStatusCode());
        $this->assertSame(['message' => 'quota exceeded message'], json_decode($response->getContent(), true));
    }

    public function testCrossDayStartsANewRow(): void
    {
        $this->mockDefaultLesson($this->mockLesson(5, 3));
        $this->mockLoggedIn($this->mockUser(1));

        // yesterday's row exists, but today's lookup returns null -> new row
        $this->mockUsageRepository(null);

        $captured = null;
        $this->om->shouldReceive('persist')->once()->with(\Mockery::on(function ($entity) use (&$captured) {
            $captured = $entity;

            return $entity instanceof AiLessonUsage;
        }));
        $this->om->shouldReceive('flush')->once();

        $response = $this->createController('{"title":"today"}')->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertInstanceOf(AiLessonUsage::class, $captured);
        $this->assertEquals(new \DateTime('today'), $captured->getPeriodDate());
        $this->assertSame(1, $captured->getCount());
        $this->assertSame(3, $captured->getLimit());
    }

    public function testAnonymousUserIsNotCounted(): void
    {
        $this->mockDefaultLesson($this->mockLesson(5, 3));
        $this->mockAnonymous();

        $this->om->shouldNotReceive('persist');
        $this->om->shouldNotReceive('flush');

        $response = $this->createController('{"title":"anon"}')->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
    }

    public function testResourceUsageLimitNullFallsBackToPlatformConfig(): void
    {
        $this->mockDefaultLesson($this->mockLesson(5, null));
        $this->mockLoggedIn($this->mockUser(1));
        $this->mockUsageRepository(null);

        $this->config->shouldReceive('getParameter')->with('mindme_ai.daily_limit')->andReturn(5);

        $captured = null;
        $this->om->shouldReceive('persist')->once()->with(\Mockery::on(function ($entity) use (&$captured) {
            $captured = $entity;

            return $entity instanceof AiLessonUsage;
        }));
        $this->om->shouldReceive('flush')->once();

        $response = $this->createController('{"title":"fallback"}')->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertInstanceOf(AiLessonUsage::class, $captured);
        $this->assertSame(5, $captured->getLimit());
    }

    public function testFailedAiCallIsNotCounted(): void
    {
        $this->mockDefaultLesson($this->mockLesson(5, 3));
        $this->mockLoggedIn($this->mockUser(1));
        $this->mockUsageRepository(null);

        $captured = null;
        $this->om->shouldReceive('persist')->once()->with(\Mockery::on(function ($entity) use (&$captured) {
            $captured = $entity;

            return $entity instanceof AiLessonUsage;
        }));
        $this->om->shouldNotReceive('flush');

        // DeepSeek call fails (empty raw content) -> 200 fallback, but no count
        $response = $this->createController('')->generate(new Request([], [], [], [], [], [], '{}'));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertInstanceOf(AiLessonUsage::class, $captured);
        $this->assertSame(0, $captured->getCount());
    }
}
