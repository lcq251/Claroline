import get from 'lodash/get'

import {url} from '#/main/app/api'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {declareAction} from '#/main/app/action'
import {MODAL_USERS} from '#/main/community/modals/users'
import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'
import {constants} from '#/plugin/cursus/constants'

export default declareAction((courses, refresher) => {
  return {
    name: 'add-users',
    type: MODAL_BUTTON,
    icon: 'fa fa-fw fa-user-plus',
    label: trans('register_users'),
    displayed: hasPermission('follow', courses[0]),
    modal: [MODAL_TRAINING_SESSIONS, {
      url: ['apiv2_cursus_course_list_sessions', {id: get(courses[0], 'id')}],
      filters: [{property: 'status', value: 'not_ended'}],
      multiple: false,
      selectAction: (selectedSessions) => ({
        type: MODAL_BUTTON,
        modal: [MODAL_USERS, {
          selectAction: (selected) => ({
            type: ASYNC_BUTTON,
            label: trans('register', {}, 'actions'),
            request: {
              url: ['apiv2_cursus_session_add_users', {
                id: selectedSessions[0] ? selectedSessions[0].id : null,
                type: constants.LEARNER_TYPE}
              ],
              request: {
                method: 'PATCH',
                body: JSON.stringify(selected.map(user => user.id))
              },
              success: () => refresher.update(courses[0])
            }
          })
        }]
      })
    }],
    scope: ['object']
  }
})
