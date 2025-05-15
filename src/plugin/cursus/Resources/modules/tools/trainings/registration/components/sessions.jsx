import React from 'react'
import {useDispatch} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ToolPage} from '#/main/core/tool'
import {PageContentList} from '#/main/app/page'
import get from 'lodash/get'

import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USERS} from '#/main/community/modals/users'

import {constants} from '#/plugin/cursus/constants'
import {RegistrationUsers} from '#/plugin/cursus/registration/components/users'
import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'
import {selectors} from '#/plugin/cursus/tools/trainings/store'

import {actions as sessionActions} from '#/plugin/cursus/session/store'

const TrainingsRegistrationSessions = (props) => {
  const dispatch = useDispatch()

  return (
    <ToolPage title={trans('registrations', {}, 'cursus')}>
      <PageContentList
        title={trans('Inscriptions aux sessions')}
        addAction={{
          name: 'add_users',
          type: MODAL_BUTTON,
          label: trans('register_users'),
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
      >
        <RegistrationUsers
          className="mb-5"
          flush={true}
          name={selectors.STORE_NAME+'.registration.sessions'}
          url={['apiv2_training_session_user_list']}
          unregisterUrl={['apiv2_training_session_user_delete']}
          customDefinition={[
            {
              order: 0,
              name: 'session',
              label: trans('session', {}, 'cursus'),
              type: 'training_session',
              displayed: true,
              filterable: true,
              sortable: true
            }, {
              name: 'session.dates[0]',
              alias: 'session.startDate',
              type: 'date',
              label: trans('start_date'),
              displayed: true,
              order: 1
            }, {
              name: 'session.dates[1]',
              alias: 'session.endDate',
              type: 'date',
              label: trans('end_date'),
              displayed: false,
              order: 2
            }
          ]}
        />
      </PageContentList>
    </ToolPage>
  )
}

export {
  TrainingsRegistrationSessions
}
