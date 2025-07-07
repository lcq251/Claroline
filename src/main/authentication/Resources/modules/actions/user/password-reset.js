import {hasPermission} from '#/main/app/security'
import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {declareAction} from '#/main/app/action'

export default declareAction((users) => {
  const processable = users.filter(user => hasPermission('administrate', user))

  return {
    name: 'password-reset',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-user-lock',
    label: trans('reset-password', {}, 'actions'),
    displayed: 0 !== processable.length,
    confirm: {
      message: transChoice('user_password_reset_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'security'),
      additional: trans('password_reset_confirm_help', {}, 'security'),
      button: trans('reset', {}, 'actions'),
      items:  processable.map(item => ({
        thumbnail: item.picture,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      type: 'send',
      url: ['apiv2_user_password_reset'],
      request: {
        method: 'PUT',
        body: JSON.stringify(processable.map(user => user.id))
      }
    },
    scope: ['object', 'collection'],
    group: trans('management'),
    title: trans('reset-password', {}, 'actions'),
    description: trans('reset_password_desc', {}, 'actions'),
    labelShort: trans('reset', {}, 'actions'),
    managerOnly: true
  }
})
