import {constants, declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {hasPermission} from '#/main/app/security'
import {supportEvaluation} from '#/main/core/resource/utils'

export default declareAction((resources) => ({
  name: 'recompute_evaluation',
  label: trans('recompute_evaluations', {}, 'actions'),
  type: ASYNC_BUTTON,
  request: {
    url: ['apiv2_resource_evaluation_recompute', {resourceId: resources[0].id}],
    request: {
      method: 'PUT'
    }
  },
  displayed: supportEvaluation(resources[0]) && hasPermission('follow', resources[0]),
  group: trans('evaluation'),
  scope: ['object'],
  set: [constants.ACTION_SET_ADVANCED, constants.ACTION_SET_DASHBOARD],
  title: trans('recompute_evaluations', {}, 'actions'),
  description: trans('recompute_resource_evaluations_help', {}, 'actions'),
  labelShort: trans('recalculate', {}, 'actions')
}))
