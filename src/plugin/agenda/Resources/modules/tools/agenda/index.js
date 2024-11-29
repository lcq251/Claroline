import {declareTool, CommandPalette} from '#/main/core/tool'

import {AgendaTool} from '#/plugin/agenda/tools/agenda/containers/tool'
import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

export default declareTool(AgendaTool, () => new CommandPalette('agenda')
  .addCommands([
    {
      name: 'plan-event',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-calendar',
      label: trans('Planifier un évènement', {}, 'command'),
      group: trans('agenda', {}, 'tools'),
      callback: () => true
    }, {
      name: 'plan-task',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-clipboard-check',
      label: trans('Planifier une tâche', {}, 'command'),
      group: trans('agenda', {}, 'tools'),
      callback: () => true
    }
  ])
)
