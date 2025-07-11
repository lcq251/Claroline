import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {url} from '#/main/app/api'
import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'

import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Deletes some resource nodes.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher - an object containing methods to update context in response to action (e.g., add, update, delete).
 */
export default declareAction((resourceNodes, nodesRefresher) => {
  const processable = resourceNodes.filter(node => !isEmpty(node.parent) && !get(node, 'meta.active', false) && hasPermission('administrate', node))

  return {
    name: 'delete',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('delete', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('resources_delete_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'resource'),
      additional: trans('irreversible_action_confirm'),
      items:  processable.map(item => ({
        thumbnail: item.poster,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: ['claro_resource_delete'],
      request: {
        method: 'DELETE',
        body: JSON.stringify(processable.map(resourceNode => resourceNode.id))
      },
      success: () => nodesRefresher.delete(processable)
    },
    group: trans('management'),
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED],
    managerOnly: true,
    title: trans('delete_resource', {}, 'actions'),
    description: trans('delete_resource_desc', {}, 'actions'),
  }
})
