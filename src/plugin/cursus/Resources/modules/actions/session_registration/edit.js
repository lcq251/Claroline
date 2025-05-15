import {declareAction} from '#/main/app/action'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

import {MODAL_REGISTRATION_PARAMETERS} from '#/plugin/cursus/registration/modals/parameters'
import {hasPermission} from '#/main/app/security'

export default declareAction((registrations, refresher) => ({
  name: 'edit',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-pencil',
  label: trans('edit', {}, 'actions'),
  displayed: hasPermission('edit', registrations[0]),
  modal: [MODAL_REGISTRATION_PARAMETERS, {
    course: registrations[0].course,
    session: registrations[0].session,
    registration: registrations[0],
    onSave: refresher.update
  }],
  group: trans('management'),
  scope: ['object']
}))
