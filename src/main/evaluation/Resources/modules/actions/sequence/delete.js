import {url} from '#/main/app/api'
import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'

import {hasPermission} from '#/main/app/security'

/**
 * Deletes some resource sequences.
 */
export default (sequences, refresher) => {
  const processable = sequences.filter(sequence => hasPermission('administrate', sequence))

  return {
    name: 'delete',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('delete', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('sequences_delete_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'evaluation'),
      additional: trans('irreversible_action_confirm'),
      items:  processable.map(item => ({
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: url(['apiv2_evaluation_sequence_delete'], {
        ids: processable.map(sequence => sequence.id)
      }),
      request: {
        method: 'DELETE'
      },
      success: () => refresher.delete(processable)
    }
  }
}
