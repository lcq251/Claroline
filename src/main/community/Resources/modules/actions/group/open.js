import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/community/group/routing'
import {declareAction} from '#/main/app/action'

/**
 * Open group action.
 */
export default declareAction((groups, refresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-up-right-from-square',
  label: trans('open', {}, 'actions'),
  displayed: hasPermission('open', groups[0]),
  target: route(groups[0], path),
  scope: ['object'],
  default: true
}))
