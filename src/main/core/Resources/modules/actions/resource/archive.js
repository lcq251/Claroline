import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'

import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Archives some resource nodes.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher - an object containing methods to update context in response to action (e.g., add, update, delete).
 */
export default declareAction((resourceNodes, nodesRefresher) => {
  const processable = resourceNodes.filter(node => !isEmpty(node.parent) && get(node, 'meta.active', false) && hasPermission('administrate', node))

  return {
    name: 'archive',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-box',
    label: trans('archive', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('resources_delete_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'resource'),
      items:  processable.map(item => ({
        thumbnail: item.poster,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: ['claro_resource_archive'],
      request: {
        method: 'POST',
        body: JSON.stringify(processable.map(resourceNode => resourceNode.id))
      },
      success: nodesRefresher.update
    },
    group: trans('management'),
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED],
    title: trans('archive_resource', {}, 'actions'),
    description: trans('archive_resource_desc', {}, 'actions'),
    managerOnly: true
  }
})
