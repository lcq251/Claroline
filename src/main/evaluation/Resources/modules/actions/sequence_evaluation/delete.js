import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'

import {hasPermission} from '#/main/app/security'
import {declareAction} from '#/main/app/action'

export default declareAction((evaluations, refresher) => {
  const processable = evaluations.filter(evaluation => hasPermission('administrate', evaluation))

  return {
    name: 'delete',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('delete', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('sequence_evaluations_delete_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'evaluation'),
      additional: trans('irreversible_action_confirm'),
      items:  processable.map(item => ({
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: ['apiv2_sequence_evaluation_delete'],
      request: {
        method: 'DELETE',
        body: JSON.stringify({ids: processable.map(evaluation => evaluation.id)})
      },
      success: () => refresher.delete(processable)
    },
    group: trans('management')
  }
})
