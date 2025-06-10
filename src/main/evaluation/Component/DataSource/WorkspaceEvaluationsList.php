<?php

namespace Claroline\EvaluationBundle\Component\DataSource;

use Claroline\AppBundle\Component\DataSource\ListSourceComponent;
use Claroline\CoreBundle\Component\Context\DesktopContext;
use Claroline\CoreBundle\Component\Context\WorkspaceContext;
use Claroline\EvaluationBundle\Finder\WorkspaceEvaluationType;

class WorkspaceEvaluationsList extends ListSourceComponent
{
    public static function getName(): string
    {
        return 'workspace_evaluations';
    }

    public function supportsContext(string $context): bool
    {
        return in_array($context, [
            DesktopContext::getName(),
            WorkspaceContext::getName(),
        ]);
    }

    public static function getClass(): string
    {
        return WorkspaceEvaluationType::class;
    }
}
