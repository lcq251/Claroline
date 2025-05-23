import {url} from '#/main/app/api'
import {hasPermission} from '#/main/app/security'
import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {declareAction} from '#/main/app/action'

export default declareAction((workspaces, refresher) => {
  const processable = workspaces.filter(workspace => hasPermission('administrate', workspace))

  return {
    name: 'copy',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-clone',
    label: trans('copy', {}, 'actions'),
    displayed: 0 !== processable.length,
    confirm: {
      message: transChoice('copy_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'workspace'),
      items:  processable.map(item => ({
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: url(['apiv2_workspace_copy'], {ids: processable.map(workspace => workspace.id)}),
      request: {
        method: 'POST'
      },
      success: refresher.update
    },
    group: trans('management'),
    scope: ['object', 'collection']
  }
})
