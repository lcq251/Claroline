<?php

namespace Claroline\EvaluationBundle\Transfer\Importer\WorkspaceEvaluation;

use Claroline\CoreBundle\Entity\Group;
use Claroline\EvaluationBundle\Entity\UserEvaluation\WorkspaceEvaluation;
use Claroline\TransferBundle\Transfer\Importer\AbstractCreateImporter;

class Create extends AbstractCreateImporter
{
    public static function getAction(): array
    {
        return ['workspace_evaluation', self::MODE_CREATE];
    }

    protected static function getClass(): string
    {
        return WorkspaceEvaluation::class;
    }
}
