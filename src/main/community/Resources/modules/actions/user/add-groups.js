import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_GROUPS} from '#/main/community/modals/groups'
import {constants, declareAction} from '#/main/app/action'

export default declareAction((users, refresher) => ({
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
        url: ['apiv2_user_add_groups', {id: users[0].id}],
        request: {
          method: 'PATCH',
          body: JSON.stringify(groups.map(group => group.id))
        },
        success: () => refresher.update(users[0])
      }
    })
  }],
  group: trans('management'),
  scope: ['object'],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
