import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/core/resource'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Displays a form to modify resource node properties.
 */
export default declareAction((resourceNodes, nodesRefresher, path) => ({
  name: 'configure',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-sliders',
  label: trans('configure', {}, 'actions'),
  target: `${route(resourceNodes[0], path)}/edit`,
  displayed: -1 !== resourceNodes.findIndex(resourceNode => hasPermission('edit', resourceNode)),
  group: trans('management'),
  scope: ['object'],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
