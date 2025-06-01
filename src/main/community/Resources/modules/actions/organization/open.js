import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/community/organization/routing'
import {hasPermission} from '#/main/app/security'
import {declareAction} from '#/main/app/action'

/**
 * Open organization action.
 */
export default declareAction((organizations, refresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-up-right-from-square',
  label: trans('open', {}, 'actions'),
  target: route(organizations[0], path),
  displayed: hasPermission('open', organizations[0]),
  scope: ['object'],
  default: true
}))
