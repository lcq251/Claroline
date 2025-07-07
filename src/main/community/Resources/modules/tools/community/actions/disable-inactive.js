import {constants, declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {constants as toolConstants} from '#/main/core/tool'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USER_DISABLE_INACTIVE} from '#/main/community/tools/community/user/modals/disable-inactive'
import {hasPermission} from '#/main/app/security'

export default declareAction((tools) => ({
  name: 'disable-inactive',
  type: MODAL_BUTTON,
  label: trans('disable_inactive_users', {}, 'actions'),
  modal: [MODAL_USER_DISABLE_INACTIVE],
  displayed: toolConstants.TOOL_DESKTOP === tools[0].contextType && hasPermission('administrate', tools[0]),
  dangerous: true,
  scope: ['object'],
  group: trans('management'),
  set: [constants.ACTION_SET_ADVANCED],
  title: trans('disable_inactive_users', {}, 'actions'),
  description: trans('disable_inactive_users_desc', {}, 'actions'),
  labelShort: trans('disable', {}, 'actions'),
  managerOnly: true
}))
