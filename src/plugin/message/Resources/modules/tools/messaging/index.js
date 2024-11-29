import {declareTool, CommandPalette} from '#/main/core/tool'

import {MessagingTool} from '#/plugin/message/tools/messaging/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

export default declareTool(MessagingTool, () => new CommandPalette('messaging')
  .addCommands([
    {
      name: 'send-message',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-envelope',
      label: trans('Envoyer un message', {}, 'command'),
      callback: () => true
    }
  ])
)
