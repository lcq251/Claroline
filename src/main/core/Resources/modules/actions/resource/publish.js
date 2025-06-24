import get from 'lodash/get'

import {ASYNC_BUTTON} from '#/main/app/buttons'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Publishes some resource nodes.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher - an object containing methods to update context in response to action (eg. add, update, delete).
 */
export default declareAction((resourceNodes, nodesRefresher) => ({
  name: 'publish',
  type: ASYNC_BUTTON,
  icon: 'fa fa-fw fa-eye',
  label: trans('publish', {}, 'actions'),
  displayed: -1 !== resourceNodes.findIndex(node => !!node.parent && !get(node, 'meta.published') && hasPermission('edit', node)),
  request: {
    type: 'publish',
    url: ['claro_resource_publish'],
    request: {
      method: 'PUT',
      body: JSON.stringify(resourceNodes.map(resourceNode => resourceNode.id))
    },
    success: (response) => nodesRefresher.update(response)
  },
  group: trans('management'),
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED]
}))
