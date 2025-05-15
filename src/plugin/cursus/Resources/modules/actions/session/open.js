import {declareAction} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

import {route} from '#/plugin/cursus/session/routing'

export default declareAction((sessions, refresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-circle-right',
  label: trans('open', {}, 'actions'),
  target: route(sessions[0], path),
  displayed: hasPermission('open', sessions[0]),
  scope: ['object'],
  default: true
}))
