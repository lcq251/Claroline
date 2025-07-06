import {declareAction} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

export default declareAction((registrations, refresher) => {
  const processable = registrations.filter(registration => !registration.validated && hasPermission('administrate', registration))

  return ({
    name: 'confirm',
    type: CALLBACK_BUTTON,
    icon: 'fa fa-fw fa-user-check',
    label: trans('confirm_registration', {}, 'actions'),
    displayed: 0 !== processable.length,
    request: {
      url: ['apiv2_training_session_user_validate'],
      request: {
        method: 'PUT',
        body: JSON.stringify(processable.map(registration => registration.id))
      },
      success: refresher.update
    },
    group: trans('management'),
    scope: ['object', 'collection']
  })
})
