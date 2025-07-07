import {constants, declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_TRANSFER} from '#/plugin/open-badge/modals/transfer'
import {hasPermission} from '#/main/app/security'
import {constants as toolConstants} from '#/main/core/tool'

export default declareAction((tools) => ({
  name: 'transfer-badges',
  type: MODAL_BUTTON,
  label: trans('transfer_badges', {}, 'actions'),
  modal: [MODAL_TRANSFER],
  displayed: toolConstants.TOOL_DESKTOP === tools[0].contextType && hasPermission('administrate', tools[0]),
  group: trans('management'),
  scope: ['object'],
  set: [constants.ACTION_SET_ADVANCED],
  title: trans('transfer_badges', {}, 'actions'),
  description: trans('transfer_badges_desc', {}, 'actions'),
  labelShort: trans('transfer', {}, 'actions'),
  managerOnly: true
}))
