<?php

namespace Claroline\PeerTubeBundle\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;

class Updater140103 extends Updater
{
    public function __construct(
        private readonly Connection $connection
    ) {
    }

    /**
     * @throws Exception
     */
    public function postUpdate(): void
    {
        $this->connection->executeStatement('
            UPDATE claro_peertube_video
            AS ptv 
            SET ptv.controls = true
        ');
    }
}
