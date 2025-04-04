import {MODAL_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

import {MODAL_ROLE_FORM} from '#/main/community/role/modals/form'

export default (roles, refresher) => ({
  name: 'edit',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-pencil',
  label: trans('edit', {}, 'actions'),
  modal: [MODAL_ROLE_FORM, {
    role: roles[0],
    onSave: refresher.update
  }],
  displayed: hasPermission('edit', roles[0]),
  primary: true,
  group: trans('management'),
  scope: ['object']
})
