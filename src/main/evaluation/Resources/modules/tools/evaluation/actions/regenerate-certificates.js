import {constants, declareAction} from '#/main/app/action'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {constants as toolConstants} from '#/main/core/tool'

export default declareAction((tools) => ({
  name: 'regenerate_certificates',
  type: ASYNC_BUTTON,
  label: trans('regenerate_certificates', {}, 'actions'),
  request: {
    url: ['apiv2_workspace_regenerate_all_certificates', {workspace: tools[0].contextId}],
    request: {
      method: 'PUT'
    }
  },
  displayed: toolConstants.TOOL_WORKSPACE === tools[0].contextType && hasPermission('follow', tools[0]),
  group: trans('evaluation'),
  scope: ['object'],
  set: [constants.ACTION_SET_ADVANCED, constants.ACTION_SET_DASHBOARD],
  title: trans('regenerate_certificates', {}, 'actions'),
  description: trans('regenerate_workspace_certificates_help', {}, 'actions'),
  labelShort: trans('regenerate', {}, 'actions'),
}))
