import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {trans} from '#/main/app/intl/translation'
import {MODAL_RESOURCES} from '#/main/core/modals/resources'
import {constants, declareAction} from '#/main/app/action'
import {hasPermission} from '#/main/app/security'

/**
 * Creates a copy of resource nodes at the destination chosen by the user.
 *
 * @param {Array}  resourceNodes  - the list of resource nodes on which we want to execute the action.
 * @param {object} nodesRefresher - an object containing methods to update context in response to action (e.g., add, update, delete).
 */
export default declareAction((resourceNodes, nodesRefresher) => {
  const processable = resourceNodes.filter(resourceNode => hasPermission('export', resourceNode))

  return ({
    name: 'copy',
    type: MODAL_BUTTON,
    icon: 'fa fa-fw fa-clone',
    label: trans('copy', {}, 'actions'),
    displayed: 0 !== processable.length,
    modal: [MODAL_RESOURCES, {
      icon: 'fa fa-fw fa-clone',
      title: trans('select_target_directory'),
      current: 0 < processable.length && processable[0].parent ? processable[0].parent : null,
      selectAction: (selected = []) => ({
        type: ASYNC_BUTTON,
        label: trans('select', {}, 'actions'),
        request: {
          url: ['claro_resource_copy', {destinationId: selected[0] ? selected[0].id : null}],
          request: {
            method: 'POST',
            body: JSON.stringify(processable.map(resourceNode => resourceNode.id))
          },
          success: (response) => {
            nodesRefresher.add(response)
            nodesRefresher.update([selected[0]])
          }
        }
      }),
      filters: [{property: 'resourceType', value: 'directory', locked: true}]
    }],
    group: trans('management'),
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED]
  })
})
