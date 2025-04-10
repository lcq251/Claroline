import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api'
import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_GROUPS} from '#/main/community/modals/groups'

export default (users, refresher) => ({
  name: 'add-groups',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-users',
  label: trans('add_groups', {}, 'actions'),
  displayed: hasPermission('administrate', users[0]),
  modal: [MODAL_GROUPS, {
    selectAction: (groups) => ({
      type: ASYNC_BUTTON,
      label: trans('add', {}, 'actions'),
      request: {
        url: url(['apiv2_user_add_groups', {id: users[0].id}], {ids: groups.map(group => group.id)}),
        request: {
          method: 'PATCH'
        },
        success: () => refresher.update(users[0])
      }
    })
  }],
  group: trans('management'),
  scope: ['object']
})
