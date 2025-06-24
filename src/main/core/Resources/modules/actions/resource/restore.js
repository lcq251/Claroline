import get from 'lodash/get'

import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Restores some soft deleted resource nodes.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher - an object containing methods to update context in response to action (eg. add, update, delete).
 */
export default declareAction((resourceNodes, nodesRefresher) => {
  const processable = resourceNodes.filter(node => !get(node, 'meta.active') && hasPermission('administrate', node))

  return {
    name: 'restore',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash-restore-alt',
    label: trans('restore', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('resources_restore_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'resource'),
      items:  processable.map(item => ({
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      })),
      dangerous: false
    },
    request: {
      url: ['claro_resource_restore'],
      request: {
        method: 'POST',
        body: JSON.stringify(processable.map(node => node.id))
      },
      success: (restoredNodes) => nodesRefresher.update(restoredNodes)
    },
    group: trans('management'),
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED]
  }
})
