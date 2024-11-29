import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USERS} from '#/main/community/modals/users'

import {selectors} from '#/plugin/cursus/course/store'
import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {constants} from '#/plugin/cursus/constants'

import {SessionUsers} from '#/plugin/cursus/session/containers/users'
import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'

const CourseParticipants = (props) =>
  <>
    <SessionUsers
      className="mt-3"
      course={props.course}
      name={selectors.STORE_NAME+'.sessionUsers'}
      customDefinition={[
        {
          name: 'session',
          label: trans('session', {}, 'cursus'),
          type: 'training_session',
          displayed: true,
          displayable: true,
          filterable: true,
          options: {
            course: props.course,
            picker: {
              url: ['apiv2_cursus_course_list_sessions', {id: get(props.course, 'id')}],
              filters: [{property: 'status', value: 'not_ended'}]
            }
          }
        }
      ]}
      add={{
        name: 'add_users',
        type: MODAL_BUTTON,
        label: trans('add_users', {}, 'actions'),
        modal: [MODAL_USERS, {
          selectAction: (selected) => ({
            type: MODAL_BUTTON,
            label: trans('register', {}, 'actions'),
            modal: [MODAL_TRAINING_SESSIONS, {
              url: ['apiv2_cursus_course_list_sessions', {id: get(props.course, 'id')}],
              filters: [{property: 'status', value: 'not_ended'}],
              selectAction: (selectedSessions) => ({
                type: CALLBACK_BUTTON,
                label: trans('register', {}, 'actions'),
                callback: () => selectedSessions.map(selectedSession => props.addUsers(selectedSession.id, selected, constants.LEARNER_TYPE))
              })
            }]
          })
        }]
      }}
    />
  </>

CourseParticipants.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  addUsers: T.func.isRequired,
  addPending: T.func.isRequired
}

export {
  CourseParticipants
}
