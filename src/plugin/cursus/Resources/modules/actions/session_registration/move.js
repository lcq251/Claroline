import get from 'lodash/get'

import {declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'

export default declareAction((registrations, refresher) => {
  const processable = registrations.filter(registration => hasPermission('administrate', registration))

  return ({
    name: 'move',
    type: MODAL_BUTTON,
    icon: 'fa fa-fw fa-arrows',
    label: trans('move', {}, 'actions'),
    displayed: 0 !== processable,
    modal: [MODAL_TRAINING_SESSIONS, {
      url: ['apiv2_cursus_course_list_sessions', {id: get(processable[0], 'course.id')}],
      multiple: false,
      selectAction: (selected) => ({
        type: ASYNC_BUTTON,
        request: {
          url: ['apiv2_training_session_user_move', {type: get(processable[0], 'type'), targetId: get(selected[0], 'id')}],
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
