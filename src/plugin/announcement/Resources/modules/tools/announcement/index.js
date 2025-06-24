import {declareTool, CommandPalette} from '#/main/core/tool'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {AnnouncementTool} from '#/plugin/announcement/tools/announcement/containers/tool'

export default declareTool(AnnouncementTool, () => new CommandPalette('announcement')
  .addCommands([
    {
      name: 'add-announcement',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-bullhorn',
      label: trans('add_announcement', {}, 'actions'),
      callback: () => true
    }
  ])
).addPermissions({
  create: {
    order: 1,
    actions: [
      'Créer et administrer de nouvelles annonces'
    ]
  },
  edit: {
    order: 10,
    actions: [
      'Administrer toutes les annonces'
    ]
  }
})
