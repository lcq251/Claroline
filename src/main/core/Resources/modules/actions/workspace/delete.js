import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans, transChoice} from '#/main/app/intl/translation'
import {declareAction} from '#/main/app/action'

/**
 * Delete workspaces action.
 */
export default declareAction((workspaces, refresher) => {
  const processable = workspaces
    .filter(w => hasPermission('delete', w) && w.code !== 'default_personal' && w.code !== 'default_workspace' && w.meta.archived)

  return {
    name: 'delete',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('delete', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('delete_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'workspace'),
      additional: trans('irreversible_action_confirm'),
      items:  processable.map(item => ({
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: ['apiv2_workspace_delete'],
      request: {
        method: 'DELETE',
        body: JSON.stringify(processable.map(w => w.id))
      },
      success: () => refresher.delete(processable)
    },
    group: trans('management'),
    scope: ['object', 'collection']
  }
})
