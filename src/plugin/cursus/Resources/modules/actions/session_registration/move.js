import {declareAction} from '#/main/app/action'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {trans, transChoice} from '#/main/app/intl'
import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'
import get from 'lodash/get'
import {hasPermission} from '#/main/app/security'

export default declareAction((registrations, refresher) => {
  const processable = registrations.filter(registration => hasPermission('administrate', registration))

  return ({
    name: 'move',
    type: MODAL_BUTTON,
    icon: 'fa fa-fw fa-arrows',
    label: trans('move', {}, 'actions'),
    displayed: 0 !== processable,
    confirm: {
      message: transChoice('session_registration_move_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'cursus'),
      items:  processable.map(registration => ({
        thumbnail: registration.user.picture,
        id: registration.user.id,
        name: registration.user.name
      }))
    },
    modal: [MODAL_TRAINING_SESSIONS, {
      url: ['apiv2_cursus_course_list_sessions', {id: get(processable[0], 'course.id')}],
      filters: [{property: 'status', value: 'not_ended'}],
      multiple: false,
      selectAction: (selected) => ({
        type: ASYNC_BUTTON,
        request: {
          url: ['apiv2_training_session_user_move', {targetId: selected[0].id}],
          request: {
            method: 'PUT',
            body: JSON.stringify({
              sessionUsers: processable.map(registration => registration.id)
            })
          },
          success: () => refresher.delete(processable)
        }
      })
    }],
    group: trans('management'),
    scope: ['object', 'collection']
  })
})
