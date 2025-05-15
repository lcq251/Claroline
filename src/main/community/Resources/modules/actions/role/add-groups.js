import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_GROUPS} from '#/main/community/modals/groups'
import {declareAction} from '#/main/app/action'

export default declareAction((roles, refresher) => ({
  name: 'add-groups',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-users',
  label: trans('add_groups', {}, 'actions'),
  modal: [MODAL_GROUPS, {
    selectAction: (groups) => ({
      type: ASYNC_BUTTON,
      label: trans('add', {}, 'actions'),
      request: {
        url: url(['apiv2_role_add_groups', {id: roles[0].id}], {ids: groups.map(group => group.id)}),
        request: {
          method: 'PATCH'
        },
        success: () => refresher.update(roles[0])
      }
    })
  }],
  group: trans('management'),
  scope: ['object']
}))
