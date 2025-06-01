import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/community/team/routing'
import {declareAction} from '#/main/app/action'

/**
 * Open team action.
 */
export default declareAction((teams, refresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-up-right-from-square',
  label: trans('open', {}, 'actions'),
  displayed: hasPermission('open', teams[0]),
  target: route(teams[0], path),
  scope: ['object'],
  default: true
}))
