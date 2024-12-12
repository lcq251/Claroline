import {declareTool, CommandPalette} from '#/main/core/tool'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {BadgeTool} from '#/plugin/open-badge/tools/badges/containers/tool'
import {BadgesPreview} from '#/plugin/open-badge/tools/badges/components/preview'

/**
 * Badges tool application.
 */
export default declareTool(BadgeTool, () => new CommandPalette('badges')
  .addCommands([
    {
      name: 'add-badge',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-trophy',
      label: trans('Ajouter un badge', {}, 'command'),
      callback: () => true
    }, {
      name: 'grant-badge',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-trophy',
      label: trans('Attribuer un badge', {}, 'command'),
      callback: () => true
    }
  ]),
  BadgesPreview
)
