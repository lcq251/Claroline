import {MODAL_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {MODAL_EVIDENCE} from '#/plugin/cursus/presence/modals/evidences'
import {constants} from '#/plugin/cursus/constants'
import {declareAction} from '#/main/app/action'

export default declareAction((registrations, refresher) => {
  const presence = registrations[0].presence

  return {
    name: 'add-evidence',
    type: MODAL_BUTTON,
    icon: 'fa fa-fw fa-file-upload',
    label: trans('add_evidence', {}, 'presence'),
    modal: [MODAL_EVIDENCE, {
      parent: presence,
      onSuccess: refresher.update,
      editable: true
    }],
    displayed: hasPermission('edit', registrations[0])
      && !!presence
      && [constants.PRESENCE_STATUS_ABSENT_UNJUSTIFIED, constants.PRESENCE_STATUS_ABSENT_JUSTIFIED].includes(presence.status)
      && (!presence.evidences || presence.evidences.length === 0),
    group: trans('management'),
    scope: ['object']
  }
})
