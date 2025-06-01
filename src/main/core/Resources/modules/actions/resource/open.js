import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/core/resource/routing'
import {declareAction} from '#/main/app/action'
import {hasPermission} from '#/main/app/security'

/**
 * Opens a resource node.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher
 * @param {string} path
 */
export default declareAction((resourceNodes, nodesRefresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-up-right-from-square',
  label: trans('open', {}, 'actions'),
  target: route(resourceNodes[0], path),
  displayed: hasPermission('open', resourceNodes[0]),
  scope: ['object'],
  default: true
}))
