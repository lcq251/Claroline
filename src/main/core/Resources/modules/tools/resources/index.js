import {declareTool, CommandPalette} from '#/main/core/tool'

import {ResourcesTool} from '#/main/core/tools/resources/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

/**
 * Resources tool application.
 */
export default declareTool(ResourcesTool, () => new CommandPalette('resources')
  .addCommands([
    {
      name: 'add-resource',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-folder',
      label: trans('Ajouter une ressource', {}, 'command'),
      callback: () => true
    }
  ])
)
