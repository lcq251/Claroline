<?php

namespace Claroline\OpenBadgeBundle\DependencyInjection\Compiler;

use Claroline\OpenBadgeBundle\Component\BadgeRule\RuleProvider;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Register service tagged with "claroline.component.badge_rule" as EventSubscriber.
 */
final class RegisterBadgeRuleSubscriberPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        if (!$container->has('event_dispatcher') || !$container->has('claroline.provider.badge_rule')) {
            return;
        }

        $eventDispatcherDefinition = $container->findDefinition('event_dispatcher');

        // Get all defined rules
        $taggedServices = $container->findTaggedServiceIds(RuleProvider::getServiceTag());
        $taggedServiceIds = array_keys($taggedServices);
        foreach ($taggedServiceIds as $id) {
            // register rules as event subscriber
            $eventDispatcherDefinition->addMethodCall('addSubscriber', [new Reference($id)]);
        }
    }
}
