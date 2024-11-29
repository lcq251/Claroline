import {declareTool, CommandPalette} from '#/main/core/tool'

import {ImportTool} from '#/main/transfer/tools/import/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

/**
 * Import tool application.
 */
export default declareTool(ImportTool, () => new CommandPalette('import')
  .addCommands([
    {
      name: 'import',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-file-import',
      label: trans('Importer un fichier', {}, 'command'),
      callback: () => true
    }
  ])
)
