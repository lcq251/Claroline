import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/plugin/open-badge/badge/routing'

/**
 * Open assertion action.
 */
export default (assertions, refresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-circle-right',
  label: trans('open', {}, 'actions'),
  displayed: hasPermission('open', assertions[0]),
  target: route(assertions[0].badge, path),
  scope: ['object'],
  default: true
})
