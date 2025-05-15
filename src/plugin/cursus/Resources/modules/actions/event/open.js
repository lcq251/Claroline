import {declareAction} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {route} from '#/plugin/cursus/event'

export default declareAction((events, refresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-circle-right',
  label: trans('open', {}, 'actions'),
  displayed: hasPermission('open', events[0]),
  target: route(events[0], path),
  scope: ['object'],
  default: true
}))
