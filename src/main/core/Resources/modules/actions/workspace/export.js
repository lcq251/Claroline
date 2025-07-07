import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {URL_BUTTON} from '#/main/app/buttons'
import {constants, declareAction} from '#/main/app/action'

export default declareAction((workspaces) => ({
  name: 'export',
  type: URL_BUTTON,
  icon: 'fa fa-fw fa-download',
  label: trans('export', {}, 'actions'),
  displayed: !!workspaces.find(workspace => hasPermission('administrate', workspace)),
  target: ['apiv2_workspace_export', {id: workspaces[0].id}],
  group: trans('transfer'),
  scope: ['object'],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED],
  title: trans('export_workspace', {}, 'actions'),
  description: trans('export_workspace_desc', {}, 'actions')
}))
