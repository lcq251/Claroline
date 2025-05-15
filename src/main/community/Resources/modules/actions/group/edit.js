import get from 'lodash/get'

import {MODAL_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

import {MODAL_GROUP_FORM} from '#/main/community/group/modals/form'
import {declareAction} from '#/main/app/action'

export default declareAction((groups, refresher) => ({
  name: 'edit',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-pencil',
  label: trans('edit', {}, 'actions'),
  modal: [MODAL_GROUP_FORM, {
    group: groups[0],
    onSave: refresher.update
  }],
  displayed: hasPermission('edit', groups[0]),
  disabled: get(groups[0], 'meta.readOnly'),
  primary: true,
  group: trans('management'),
  scope: ['object']
}))
