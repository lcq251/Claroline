<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TemplateBundle\Controller;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\TemplateBundle\Entity\Template;
use Symfony\Component\Routing\Attribute\Route;

#[Route(path: '/template', name: 'apiv2_template_')]
class TemplateController extends AbstractCrudController
{
    public static function getName(): string
    {
        return 'template';
    }

    public static function getClass(): string
    {
        return Template::class;
    }
}
