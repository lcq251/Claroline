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
  const processable = resourceNodes.filter(node => !isEmpty(node.parent) && hasPermission('administrate', node))

  const archive = -1 === processable.findIndex(node => get(node, 'meta.active'))

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
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: archive ?
        ['claro_resource_archive'] :
        ['claro_resource_delete']
      ,
      request: {
        method: archive ? 'POST' : 'DELETE',
        body: JSON.stringify(processable.map(resourceNode => resourceNode.id))
      },
      success: () => nodesRefresher.delete(processable)
    },
    group: trans('management'),
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED]
  }
})
