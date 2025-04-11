<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\InstallationBundle\Tests\Migrations;

use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\InstallationBundle\Migrations\Generator;
use Claroline\InstallationBundle\Migrations\Writer;
use Mockery as m;
use Mockery\MockInterface;
use org\bovigo\vfs\vfsStream;

class WriterTest extends MockeryTestCase
{
    private MockInterface $twigEnvironment;
    private MockInterface $fileSystem;

    protected function setUp(): void
    {
        parent::setUp();
        $this->twigEnvironment = m::mock('Twig\Environment');
        $this->fileSystem = m::mock('Symfony\Component\Filesystem\Filesystem');
    }

    public function testWriteMigrationClasses(): void
    {
        vfsStream::setup(
            'root',
            null,
            [
                'bundle' => [
                    'path' => [
                        'Installation' => [
                            'Migrations' => [
                                'Versionsome_version.php' => '',
                            ],
                        ],
                    ],
                ],
            ]
        );

        $bundlePath = vfsStream::url('root').'/bundle/path';

        $bundle = m::mock('Symfony\Component\HttpKernel\Bundle\Bundle');
        $bundle->shouldReceive('getPath')->once()->andReturn($bundlePath);
        $this->fileSystem->shouldReceive('exists')
            ->once()
            ->with(implode(DIRECTORY_SEPARATOR, [$bundlePath, 'Installation', 'Migrations']))
            ->andReturn(false);
        $this->fileSystem->shouldReceive('mkdir')
            ->once()
            ->with(implode(DIRECTORY_SEPARATOR, [$bundlePath, 'Installation', 'Migrations']));
        $this->twigEnvironment->shouldReceive('render')
            ->once()
            ->with(
                '@ClarolineInstallation/migration_class.html.twig',
                [
                    'namespace' => 'Bundle\Namespace\Installation\Migrations',
                    'class' => 'Versionsome_version',
                    'upQueries' => 'queries up',
                    'downQueries' => 'queries down',
                ]
            )
            ->andReturn('migration class content');
        $this->fileSystem->shouldReceive('touch')
            ->once()
            ->with(implode(DIRECTORY_SEPARATOR, [$bundlePath, 'Installation', 'Migrations', 'Versionsome_version.php']));

        $writer = new Writer($this->fileSystem, $this->twigEnvironment);
        $writer->writeMigrationClass(
            $bundle,
            'Bundle\Namespace\Installation\Migrations\Versionsome_version',
            [Generator::QUERIES_UP => 'queries up', Generator::QUERIES_DOWN => 'queries down']
        );
        static::assertEquals(
            'migration class content',
            file_get_contents(vfsStream::url('root').'/bundle/path/Installation/Migrations/Versionsome_version.php')
        );
    }
}
