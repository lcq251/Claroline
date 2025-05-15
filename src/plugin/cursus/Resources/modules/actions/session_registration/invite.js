import {constants as actionConstants, declareAction} from '#/main/app/action'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {url} from '#/main/app/api'
import {hasPermission} from '#/main/app/security'

export default declareAction((registrations) => {
  const processable = registrations.filter(registration => hasPermission('administrate', registration) && !!registration.session)

  return ({
    name: 'invite',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-envelope',
    label: trans('send_invitation', {}, 'actions'),
    displayed: 0 !== processable.length,
    request: {
      type: actionConstants.ACTION_SEND,
      url: url(['apiv2_training_session_user_invite'], {ids: processable.map(user => user.id)}),
      request: {
        method: 'PUT'
      }
    },
    scope: ['object', 'collection']
  })
})
