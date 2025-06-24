import {declareTool, CommandPalette} from '#/main/core/tool'

import {WorkspacesTool} from '#/main/core/tools/workspaces/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

/**
 * Workspaces tool application.
 */
export default declareTool(WorkspacesTool, () => new CommandPalette('workspaces')
  .addCommands([
    {
      name: 'add-workspace',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-book',
      label: trans('Ajouter un espace d\'activité', {}, 'command'),
      callback: () => true
    }
  ])
).addPermissions({
  create: {
    order: 1,
    actions: [
      'Créer et administrer de nouveaux espaces'
    ]
  },
  archive: {
    order: 2,
    actions: [
      'Archiver des espaces'
    ]
  },
  edit: {
    order: 10,
    actions: [
      'Administrer tous les espaces',
      'Copier des espaces'
    ]
  }
})
