import {declareTool, CommandPalette} from '#/main/core/tool'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {AnnouncementTool} from '#/plugin/announcement/tools/announcement/containers/tool'
import {AnnouncementPreview} from '#/plugin/announcement/tools/announcement/components/preview'

export default declareTool(AnnouncementTool, () => new CommandPalette('announcement')
  .addCommands([
    {
      name: 'add-announcement',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-bullhorn',
      label: trans('add_announcement', {}, 'actions'),
      callback: () => true
    }
  ]),
  AnnouncementPreview
)
