import {trans} from '#/main/app/intl/translation'

import {hasPermission} from '#/main/app/security'
import {MODAL_USER_PROGRESSION} from '#/main/evaluation/sequence/modals/user-progression'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_RESOURCE_EVALUATIONS} from '#/main/evaluation/modals/resource-evaluations'

export default (evaluations) => ({
  name: 'open',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-eye',
  label: trans('open', {}, 'actions'),
  displayed: hasPermission('open', evaluations[0]),
  scope: ['object'],
  modal: [MODAL_RESOURCE_EVALUATIONS, {
    userEvaluation: evaluations[0]
  }],
  default: true
})
