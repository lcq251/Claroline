import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/core/resource/routing'
import {declareAction, constants} from '#/main/app/action'
import {hasPermission} from '#/main/app/security'

/**
 * Opens a resource parent directory.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher
 * @param {string} path
 */
export default declareAction((resourceNodes, nodesRefresher, path) => ({
  name: 'open-parent',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-folder-tree',
  label: trans('open-directory', {}, 'actions'),
  displayed: hasPermission('edit', resourceNodes[0]) && !!resourceNodes[0].parent,
  target: !!resourceNodes[0].parent ? route(resourceNodes[0].parent, path) : '',
  scope: [constants.ACTION_SCOPE_OBJECT],
  set: [constants.ACTION_SET_DETAILS],
  exact: true
}))
