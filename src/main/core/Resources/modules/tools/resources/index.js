import {declareTool, CommandPalette} from '#/main/core/tool'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ResourcesTool} from '#/main/core/tools/resources/containers/tool'

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
).addPermissions({
  follow: {
    order: 5,
    actions: [
      'Voir le tableau de bord de l\'outil'
    ]
  }
})
