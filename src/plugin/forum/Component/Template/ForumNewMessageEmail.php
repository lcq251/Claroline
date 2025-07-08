<?php

namespace Claroline\ForumBundle\Component\Template;

use Claroline\TemplateBundle\Component\Template\EmailComponent;
use Claroline\TemplateBundle\Library\SystemTemplate;
use Claroline\TemplateBundle\Model\TemplateInterface;

final class ForumNewMessageEmail extends EmailComponent
{
    public static function getName(): string
    {
        return 'forum_new_message';
    }

    public function getPlaceholders(): array
    {
        return [
            'forum',
            'forum_url',
            'subject',
            'subject_url',
            'message',
            'post_datetime_utc',
            'post_date_utc',
            'post_time_utc',
            'post_datetime',
            'post_date',
            'post_time',
            'author',
            'workspace',
            'workspace_url',
        ];
    }

    public function getSystemTemplate(): TemplateInterface
    {
        return (new SystemTemplate())
            ->addTemplateContent(
                'en',
                '%subject%',
                $this->twig->render('@ClarolineForum/template/forum_new_message.en.html.twig')
            )
            ->addTemplateContent(
                'fr',
                '%subject%',
                $this->twig->render('@ClarolineForum/template/forum_new_message.fr.html.twig')
            );
    }
}
