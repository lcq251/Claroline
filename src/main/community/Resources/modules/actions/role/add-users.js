import {trans} from '#/main/app/intl/translation'

import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USERS} from '#/main/community/modals/users'
import {declareAction} from '#/main/app/action'

export default declareAction((roles, refresher) => ({
  name: 'add-users',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-user-plus',
  label: trans('add_users', {}, 'actions'),
  modal: [MODAL_USERS, {
    selectAction: (users) => ({
      type: ASYNC_BUTTON,
      label: trans('add', {}, 'actions'),
      request: {
        url: ['apiv2_role_add_users', {id: roles[0].id}],
        request: {
          method: 'PATCH',
          body: JSON.stringify(users.map(user => user.id))
        },
        success: () => refresher.update(roles[0])
      }
    })
  }],
  group: trans('management'),
  scope: ['object']
}))
