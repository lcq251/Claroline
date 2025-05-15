import {declareAction} from '#/main/app/action'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/form'
import {hasPermission} from '#/main/app/security'

export default declareAction((sessions, refresher) => ({
  name: 'edit',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-pencil',
  label: trans('edit', {}, 'actions'),
  modal: [MODAL_SESSION_FORM, {
    session: sessions[0],
    onSave: () => refresher.update(sessions[0])
  }],
  scope: ['object'],
  displayed: hasPermission('edit', sessions[0]),
  group: trans('management')
}))
