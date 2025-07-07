import {constants, declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {hasPermission} from '#/main/app/security'
import {supportEvaluation} from '#/main/core/resource/utils'

export default declareAction((resources) => ({
  name: 'purge_evaluation',
  label: trans('purge_evaluations', {}, 'actions'),
  type: ASYNC_BUTTON,
  confirm: {
    message: trans('purge_sequence_evaluations_confirm', {}, 'actions'),
    additional: trans('irreversible_action_confirm')
  },
  request: {
    url: ['apiv2_resource_evaluation_purge', {resourceId: resources[0].id}],
    request: {
      method: 'DELETE'
    }
  },
  displayed: supportEvaluation(resources[0]) && hasPermission('administrate', resources[0]),
  group: trans('evaluation'),
  scope: ['object'],
  set: [constants.ACTION_SET_ADVANCED, constants.ACTION_SET_DASHBOARD],
  dangerous: true,
  title: trans('purge_evaluations', {}, 'actions'),
  description: trans('purge_resource_evaluations_help', {}, 'actions'),
  labelShort: trans('purge', {}, 'actions'),
  managerOnly: true
}))
