import {declareTool, CommandPalette} from '#/main/core/tool'

import {LocationsTool} from '#/main/core/tools/locations/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

export default declareTool(LocationsTool, () => new CommandPalette('locations')
  .addCommands([
    {
      name: 'add-location',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-map-marker-alt',
      label: trans('Ajouter un lieu', {}, 'command'),
      callback: () => true
    }
  ])
)
