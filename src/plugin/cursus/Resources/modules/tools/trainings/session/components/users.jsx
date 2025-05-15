import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {ToolPage} from '#/main/core/tool'
import {PageContentList} from '#/main/app/page'

import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USERS} from '#/main/community/modals/users'
import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'
import {RegistrationUsers} from '#/plugin/cursus/registration/components/users'

const TrainingsSessionUsers = (props) =>
  <ToolPage
    title={props.title}
  >
    <PageContentList
      title={props.title}
      addAction={{
        name: 'add_users',
        type: MODAL_BUTTON,
        label: trans('register_users'),
        modal: [MODAL_TRAINING_SESSIONS, {
          url: ['apiv2_cursus_course_list_sessions', {id: get(props.course, 'id')}],
          filters: [{property: 'status', value: 'not_ended'}],
          selectAction: (selectedSessions) => ({
            type: MODAL_BUTTON,
            label: trans('register', {}, 'actions'),
            modal: [MODAL_USERS, {
              selectAction: (selected) => ({

                type: CALLBACK_BUTTON,
                label: trans('register', {}, 'actions'),
                callback: () => selectedSessions.map(selectedSession => props.addUsers(selectedSession.id, selected, props.type))
              })
            }]
          })
        }]
      }}
    >
      <RegistrationUsers
        className="mb-5"
        flush={true}
        name={props.name}
        url={['apiv2_training_session_user_list']}
        unregisterUrl={['apiv2_training_session_user_delete']}
        customDefinition={[
          {
            name: 'course',
            label: trans('course', {}, 'cursus'),
            type: 'training_course',
            displayed: true,
            filterable: true,
            sortable: true,
            order: 1
          }, {
            name: 'session',
            label: trans('session', {}, 'cursus'),
            type: 'training_session',
            displayed: true,
            filterable: true,
            sortable: true,
            order: 1
          }
        ]}
      />
    </PageContentList>
  </ToolPage>

TrainingsSessionUsers.propTypes = {
  path: T.string.isRequired,
  title: T.string.isRequired,
  type: T.string.isRequired,
  name: T.string.isRequired,
  canRegister: T.bool.isRequired
}

export {
  TrainingsSessionUsers
}
