import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api'

import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USERS} from '#/main/community/modals/users'
import {hasPermission} from '#/main/app/security'

export default (groups, refresher) => ({
  name: 'add-users',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-user-plus',
  label: trans('add_users', {}, 'actions'),
  displayed: !get(groups[0], 'meta.everyone', false) && hasPermission('edit', groups[0]),
  modal: [MODAL_USERS, {
    selectAction: (users) => ({
      type: ASYNC_BUTTON,
      label: trans('add', {}, 'actions'),
      request: {
        url: url(['apiv2_group_add_users', {id: groups[0].id}], {ids: users.map(user => user.id)}),
        request: {
          method: 'PATCH'
        },
        success: () => refresher.update(groups[0])
      }
    })
  }],
  group: trans('management'),
  scope: ['object']
})
