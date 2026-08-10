<?php

namespace Claroline\MindMeAiBundle;

use Claroline\KernelBundle\Bundle\DistributionPluginBundle;
use Claroline\MindMeAiBundle\DependencyInjection\Compiler\MindmeAiPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class ClarolineMindMeAiBundle extends DistributionPluginBundle
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);

        $container->addCompilerPass(new MindmeAiPass());
    }
}
