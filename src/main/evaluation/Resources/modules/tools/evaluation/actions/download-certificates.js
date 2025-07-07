import {constants, declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {constants as toolConstants} from '#/main/core/tool'
import {hasPermission} from '#/main/app/security'

export default declareAction((tools) => ({
  name: 'download_certificates',
  type: ASYNC_BUTTON,
  label: trans('download_certificates', {}, 'actions'),
  request: {
    url: ['apiv2_workspace_download_all_certificates', {workspace: tools[0].contextId}]
  },
  displayed: toolConstants.TOOL_WORKSPACE === tools[0].contextType && hasPermission('follow', tools[0]),
  scope: ['object'],
  set: [constants.ACTION_SET_ADVANCED, constants.ACTION_SET_DASHBOARD],
  title: trans('download_certificates', {}, 'actions'),
  description: trans('download_workspace_certificates_help', {}, 'actions'),
  labelShort: trans('download', {}, 'actions'),
}))
