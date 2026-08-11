<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MindMeAiBundle\Tests\Unit\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\EventPresence;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Claroline\MindMeAiBundle\Entity\AiLesson;
use Claroline\MindMeAiBundle\Manager\DashboardStatsManager;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Doctrine\ORM\EntityRepository;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class DashboardStatsManagerTest extends MockeryTestCase
{
    private $om;
    private $tokenStorage;
    private $config;

    protected function setUp(): void
    {
        parent::setUp();

        $this->om = $this->mock(ObjectManager::class);
        $this->tokenStorage = $this->mock(TokenStorageInterface::class);
        $this->config = $this->mock(PlatformConfigurationHandler::class);
    }

    private function createManager(): DashboardStatsManager
    {
        return new DashboardStatsManager($this->om, $this->tokenStorage, $this->config);
    }

    private function mockToken(?User $user): void
    {
        if (null === $user) {
            $this->tokenStorage->shouldReceive('getToken')->andReturn(null);

            return;
        }

        $token = $this->mock(TokenInterface::class);
        $token->shouldReceive('getUser')->andReturn($user);
        $this->tokenStorage->shouldReceive('getToken')->andReturn($token);
    }

    private function mockUser(array $roles): User
    {
        $user = $this->mock(User::class);
        $user->shouldReceive('getRoles')->andReturn($roles);

        return $user;
    }

    private function mockRepo(string $class, int $count): EntityRepository
    {
        $repo = $this->mock(EntityRepository::class);
        $repo->shouldReceive('count')->andReturn($count);
        $this->om->shouldReceive('getRepository')->with($class)->andReturn($repo);

        return $repo;
    }

    public function testAnonymousUserGetsBothStatsNull(): void
    {
        $this->mockToken(null);

        $data = $this->createManager()->getBoardData();

        $this->assertNull($data['greeting']['sub']);
        $this->assertNull($data['stats']['teacher']);
        $this->assertNull($data['stats']['student']);
    }

    public function testOtherRoleGetsBothStatsNull(): void
    {
        $this->mockToken($this->mockUser(['ROLE_USER']));

        $data = $this->createManager()->getBoardData();

        $this->assertNull($data['greeting']['sub']);
        $this->assertNull($data['stats']['teacher']);
        $this->assertNull($data['stats']['student']);
    }

    public function testManagerRoleGetsTeacherStats(): void
    {
        $this->mockToken($this->mockUser(['ROLE_USER', 'ROLE_WS_MANAGER']));

        $this->config->shouldReceive('getParameter')->with('restrictions.storage')->andReturn(10737418240); // 10 GB
        $this->config->shouldReceive('getParameter')->with('restrictions.used_storage')->andReturn(6657199308); // ~6.2 GB
        $this->mockRepo(ResourceNode::class, 128);
        $this->mockRepo(AiLesson::class, 0);
        $this->mockRepo(Course::class, 8);
        $this->mockRepo(SessionUser::class, 342);

        $data = $this->createManager()->getBoardData();

        $this->assertSame('dashboard_greeting_teacher_sub', $data['greeting']['sub']);
        $this->assertNull($data['stats']['student']);

        $teacher = $data['stats']['teacher'];
        $this->assertSame(10.0, $teacher['storage_total']);
        $this->assertSame(6.2, $teacher['storage_used']);
        $this->assertSame(128, $teacher['resources']);
        $this->assertSame(0, $teacher['apps']);
        $this->assertSame(8, $teacher['courses']);
        $this->assertSame(342, $teacher['registrations']);
    }

    public function testCollaboratorRoleGetsStudentStats(): void
    {
        $user = $this->mockUser(['ROLE_USER', 'ROLE_WS_COLLABORATOR']);
        $this->mockToken($user);

        $sessionUserRepo = $this->mock(EntityRepository::class);
        $sessionUserRepo->shouldReceive('count')->with(['user' => $user])->andReturn(5);
        $this->om->shouldReceive('getRepository')->with(SessionUser::class)->andReturn($sessionUserRepo);

        // courses_completed DQL query
        $queryBuilder = $this->mock('Doctrine\ORM\QueryBuilder');
        $query = $this->mock('Doctrine\ORM\Query');
        $queryBuilder->shouldReceive('join')->andReturnSelf();
        $queryBuilder->shouldReceive('where')->andReturnSelf();
        $queryBuilder->shouldReceive('andWhere')->andReturnSelf();
        $queryBuilder->shouldReceive('setParameter')->andReturnSelf();
        $queryBuilder->shouldReceive('select')->andReturnSelf();
        $queryBuilder->shouldReceive('getQuery')->andReturn($query);
        $query->shouldReceive('getSingleScalarResult')->andReturn(3);
        $sessionUserRepo->shouldReceive('createQueryBuilder')->with('su')->andReturn($queryBuilder);

        $this->mockRepo(ResourceNode::class, 12);
        $this->mockRepo(Assertion::class, 4);

        $presenceRepo = $this->mock(EntityRepository::class);
        $presenceRepo->shouldReceive('count')->with(['user' => $user])->andReturn(50);
        $presenceRepo->shouldReceive('count')->with(['user' => $user, 'status' => 'present'])->andReturn(46);
        $this->om->shouldReceive('getRepository')->with(EventPresence::class)->andReturn($presenceRepo);

        $data = $this->createManager()->getBoardData();

        $this->assertSame('dashboard_greeting_student_sub', $data['greeting']['sub']);
        $this->assertNull($data['stats']['teacher']);

        $student = $data['stats']['student'];
        $this->assertSame(5, $student['courses_registered']);
        $this->assertSame(3, $student['courses_completed']);
        $this->assertSame(12, $student['resources_published']);
        $this->assertSame(0, $student['apps_published']);
        $this->assertSame(4, $student['badges']);
        $this->assertSame(92, $student['attendance']);
    }

    public function testIncomeIsAlwaysPending(): void
    {
        $this->assertSame([
            'status' => 'pending',
            'income' => null,
            'cost' => null,
        ], $this->createManager()->getIncome());
    }
}
