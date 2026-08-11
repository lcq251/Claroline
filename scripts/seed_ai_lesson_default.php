<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
 * Idempotent seeding of the platform default AiLesson (AI model resource,
 * C-24). Creates — or updates — the single default instance:
 *
 *   is_default = true
 *   name       = 「默认 AI 资源」
 *   modelName  = 'qwen-max' (placeholder, admin picks the real model)
 *   apiKey     = left empty, admin fills it later (plaintext never stored)
 *
 * Usage (inside the app container, as www-data):
 *   php scripts/seed_ai_lesson_default.php
 *
 * Safe to run multiple times: the default instance is looked up by
 * is_default = true and updated in place; admin edits (model/key/expiry)
 * are never overwritten — only the first-time contract is filled.
 */

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\KernelBundle\Kernel;
use Claroline\MindMeAiBundle\Entity\AiLesson;

require dirname(__DIR__).'/vendor/autoload.php';
require dirname(__DIR__).'/config/bootstrap.php';

const DEFAULT_AI_LESSON_NAME = '默认 AI 资源';
const DEFAULT_AI_LESSON_MODEL = 'qwen-max';

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();

/** @var ObjectManager $om */
$om = $kernel->getContainer()->get(ObjectManager::class);
/** @var ResourceManager $resourceManager */
$resourceManager = $kernel->getContainer()->get('claroline.manager.resource_manager');

$lesson = $om->getRepository(AiLesson::class)->findOneBy(['isDefault' => true]);
$created = false;

if (null === $lesson) {
    $resourceType = $om->getRepository(ResourceType::class)->findOneBy(['name' => 'ai_lesson']);

    if (null === $resourceType) {
        fwrite(STDERR, "Resource type 'ai_lesson' is not registered (plugin not installed?).\n");
        $kernel->shutdown();

        exit(1);
    }

    $lesson = new AiLesson();
    $lesson->setName(DEFAULT_AI_LESSON_NAME);
    $lesson->setIsDefault(true);
    $lesson->setModelName(DEFAULT_AI_LESSON_MODEL);
    // apiKey intentionally left empty: admin fills it from the UI

    $resourceManager->create(
        $lesson,
        $resourceType,
        null, // creator (CLI context)
        null, // workspace (platform-level definition)
        null, // parent
        [],   // rights
        false, // not published: definition row, not browsed as content
        false  // no rights rows
    );

    $created = true;
} else {
    // fill the first-time contract only; never overwrite admin edits
    if (null === $lesson->getModelName()) {
        $lesson->setModelName(DEFAULT_AI_LESSON_MODEL);
        $om->persist($lesson);
        $om->flush();
    }
}

$kernel->shutdown();

echo ($created ? 'Created' : 'Updated')." default AiLesson (id: {$lesson->getId()}, name: {$lesson->getName()}, model: {$lesson->getModelName()})\n";
