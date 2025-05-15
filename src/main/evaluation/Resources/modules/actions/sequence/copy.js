import {url} from '#/main/app/api'
import {ASYNC_BUTTON} from '#/main/app/buttons'

import {trans, transChoice} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Creates a copy of sequences chosen by the user.
 *
 * @param {Array}  sequences  - the list of sequences on which we want to execute the action.
 * @param {object} refresher - an object containing methods to update context in response to action (eg. add, update, delete).
 */
export default declareAction((sequences, refresher) => {
  const processable = sequences.filter(sequence => hasPermission('edit', sequence))

  return ({
    name: 'copy',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-clone',
    label: trans('copy', {}, 'actions'),
    displayed: 0 !== processable.length,
    confirm: {
      message: transChoice('copy_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'sequence'),
      items:  processable.map(item => ({
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: url(['apiv2_evaluation_sequence_copy'], {ids: processable.map(workspace => workspace.id)}),
      request: {
        method: 'PUT'
      },
      success: refresher.update
    },
    group: trans('management'),
    scope: ['object', 'collection'],
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED]
  })
})
