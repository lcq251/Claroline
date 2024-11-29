import {declareTool, CommandPalette} from '#/main/core/tool'

import {TagsTool} from '#/plugin/tag/tools/tags/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'


/**
 * Tags tool application.
 */
export default declareTool(TagsTool, () => new CommandPalette('tags')
  .addCommands([
    {
      name: 'add-tag',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-tags',
      label: trans('Ajouter un tag', {}, 'command'),
      callback: () => true
    }
  ])
)
