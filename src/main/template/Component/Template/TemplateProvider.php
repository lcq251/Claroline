<?php

namespace Claroline\TemplateBundle\Component\Template;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Component\AbstractComponentProvider;
use Claroline\AppBundle\Component\Context\ContextSubjectInterface;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\Tool\ToolRights;
use Claroline\CoreBundle\Event\CatalogEvents\ToolEvents;
use Claroline\CoreBundle\Event\Tool\ConfigureToolEvent;
use Claroline\CoreBundle\Event\Tool\ExportToolEvent;
use Claroline\CoreBundle\Event\Tool\ImportToolEvent;
use Claroline\CoreBundle\Event\Tool\OpenToolEvent;
use Claroline\CoreBundle\Repository\Tool\OrderedToolRepository;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Aggregates all the templates defined in the Claroline app.
 *
 * A template MUST :
 *   - be declared as a symfony service and tagged with "claroline.component.template".
 *   - implement the TemplateInterface interface (or the AbstractTemplate class in most cases).
 */
final class TemplateProvider extends AbstractComponentProvider
{
    public function __construct(
        private readonly iterable $registeredTemplates
    ) {
    }

    final public static function getServiceTag(): string
    {
        return 'claroline.component.template';
    }

    /**
     * Get the list of all the tools injected in the app by the current plugins.
     * It does not contain tools for disabled plugins.
     */
    protected function getRegisteredComponents(): iterable
    {
        return $this->registeredTemplates;
    }
}
