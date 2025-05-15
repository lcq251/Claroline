import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/core/tool/routing'
import {constants, declareAction} from '#/main/app/action'

/**
 * Open tool action.
 */
export default declareAction((tools, toolRefresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-circle-right',
  label: trans('open', {}, 'actions'),
  target: route(tools[0].name, path),
  scope: ['object'],
  default: true
}))
