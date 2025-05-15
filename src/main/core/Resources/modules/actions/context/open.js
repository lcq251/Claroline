import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/app/context/routing'
import {declareAction} from '#/main/app/action'

/**
 * Open context action.
 */
export default declareAction((contexts) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-circle-right',
  label: trans('open', {}, 'actions'),
  target: route(contexts[0].type, contexts[0].slug),
  scope: ['object'],
  default: true
}))
