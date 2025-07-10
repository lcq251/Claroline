import get from 'lodash/get'

import {constants, declareAction} from '#/main/app/action'
import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_RESOURCES} from '#/main/core/modals/resources'

/**
 * Moves resource nodes to the destination chosen by the user.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher - an object containing methods to update context in response to action (e.g., add, update, delete).
 */
export default declareAction((resourceNodes, nodesRefresher) => {
  const processable = resourceNodes.filter(resourceNode => !!resourceNode.parent && hasPermission('administrate', resourceNode))

  return ({
    name: 'move',
    type: MODAL_BUTTON,
    icon: 'fa fa-fw fa-arrows',
    label: trans('move', {}, 'actions'),
    displayed: 0 !== processable.length,
    modal: [MODAL_RESOURCES, {
      contextId: get(processable[0], 'workspace.id'),
      title: trans('select_target_directory'),
      current: 0 < processable.length && processable[0].parent ? processable[0].parent : null,
      selectAction: (selected = []) => ({
        type: ASYNC_BUTTON,
        label: trans('select', {}, 'actions'),
        request: {
          url: ['claro_resource_move', {destinationId: selected[0] ? selected[0].id : null}],
          request: {
            method: 'PUT',
            body: JSON.stringify(processable.map(resourceNode => resourceNode.id))
          },
          success: (response) => {
            nodesRefresher.delete(resourceNodes)
            nodesRefresher.add(response)
          }
        }
      }),
      filters: [{property: 'resourceType', value: 'directory', locked: true}]
    }],
    group: trans('management'),
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED],
    managerOnly: true,
    title: trans('move_resource', {}, 'actions'),
    description: trans('move_resource_desc', {}, 'actions')
  })
})
