<?php

namespace Claroline\CoreBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\InstallationBundle\Updater\Helper\RemovePluginTrait;
use Claroline\InstallationBundle\Updater\Helper\RemoveToolTrait;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;

class Updater150000 extends Updater
{
    use RemovePluginTrait;
    use RemoveToolTrait;

    public function __construct(
        private readonly Connection $connection,
        private readonly ObjectManager $om,
        private readonly PlatformConfigurationHandler $config
    ) {
    }

    public function postUpdate(): void
    {
        $this->updateConfig();
        $this->removeOldPlugins();
        $this->removeAccountContext();

        $this->removeTool('connection_messages');
    }

    private function updateConfig(): void
    {
        $locale = $this->config->getParameter('locales.default');
        if ($locale) {
            $this->config->setParameter('intl.locale', $locale);
        }
    }

    private function removeOldPlugins(): void
    {
        $this->removePlugin('Icap', 'NotificationBundle');
        $this->removePlugin('Icap', 'BibliographyBundle');
        $this->removePlugin('Claroline', 'RssBundle');
        $this->removePlugin('Icap', 'FormulaPluginBundle');
        $this->removePlugin('Claroline', 'HistoryBundle');
        $this->removePlugin('HeVinci', 'CompetencyBundle');
        $this->removePlugin('Claroline', 'SlideshowBundle');

        $this->removeTool('notifications');
    }

    private function removeAccountContext(): void
    {
        $deleteTool = $this->connection->prepare(
            'DELETE FROM claro_ordered_tool WHERE context_name = "account"'
        );
        $deleteTool->executeQuery();
    }
}
