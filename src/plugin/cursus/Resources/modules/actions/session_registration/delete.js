import {declareAction} from '#/main/app/action'
import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans, transChoice} from '#/main/app/intl'

export default declareAction((registrations, refresher) => {
  const processable = registrations.filter(registration => hasPermission('administrate', registration))

  return {
    name: 'delete',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('unregister', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('session_registration_delete_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'cursus'),
      additional: trans('irreversible_action_confirm'),
      items:  processable.map(registration => ({
        thumbnail: registration.user.picture,
        id: registration.user.id,
        name: registration.user.name
      }))
    },
    request: {
      url: ['apiv2_training_session_user_delete'],
      request: {
        method: 'DELETE',
        body: JSON.stringify(processable.map(registration => registration.id))
      },
      success: () => refresher.delete(processable)
    },
    group: trans('management'),
    scope: ['object', 'collection']
  }
})
