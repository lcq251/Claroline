import {declareTool, CommandPalette} from '#/main/core/tool'

import {ExportTool} from '#/main/transfer/tools/export/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

/**
 * Export tool application.
 */
export default declareTool(ExportTool, () => new CommandPalette('export')
  .addCommands([
    {
      name: 'export',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-file-export',
      label: trans('Exporter un fichier', {}, 'command'),
      callback: () => true
    }
  ])
).addPermissions({
  export: {
    order: 1,
    actions: [
      'Créer et administrer de nouveaux exports'
    ]
  },
  follow: {
    order: 5,
    actions: [
      'Relancer les exports'
    ]
  },
  edit: {
    order: 10,
    actions: [
      'Administrer tous les exports'
    ]
  },
})
