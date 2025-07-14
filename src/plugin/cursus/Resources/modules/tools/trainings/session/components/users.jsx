import React, {useMemo} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl'
import {ToolPage} from '#/main/core/tool'
import {PageContentList} from '#/main/app/page'
import {ASYNC_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USERS} from '#/main/community/modals/users'
import {selectors as securitySelectors} from '#/main/app/security'
import {actions as listActions} from '#/main/app/content/list'

import {constants} from '#/plugin/cursus/constants'
import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'
import {RegistrationUsers} from '#/plugin/cursus/registration/components/users'
import {getRegistrationActions, getRegistrationDefaultAction} from '#/plugin/cursus/session/utils'

const TrainingsSessionUsers = (props) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(securitySelectors.currentUser)

  const refresher = useMemo(() => merge({
    add:    () => dispatch(listActions.invalidateData(props.name)),
    update: () => dispatch(listActions.invalidateData(props.name)),
    delete: () => dispatch(listActions.invalidateData(props.name))
  }, props.refresher || {}), [props.path])

  return (
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
            url: ['apiv2_cursus_session_context_list', {context: props.contextType, contextId: props.contextId}],
            multiple: false,
            selectAction: (selectedSessions) => ({
              type: MODAL_BUTTON,
              label: trans('select', {}, 'actions'),
              modal: [MODAL_USERS, {
                selectAction: (selected) => ({
                  type: ASYNC_BUTTON,
                  label: trans('register', {}, 'actions'),
                  request: {
                    url: ['apiv2_cursus_session_add_users', {id: selectedSessions[0].id, type: props.type}],
                    request: {
                      method: 'PATCH',
                      body: JSON.stringify(selected.map(user => user.id))
                    },
                    success: () => dispatch(listActions.invalidateData(props.name))
                  }
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
          url={['apiv2_training_session_user_context_list', {context: props.contextType, contextId: props.contextId}]}
          primaryAction={(row) => getRegistrationDefaultAction(row, refresher, props.path, currentUser)}
          actions={(rows) => getRegistrationActions(rows, refresher, props.path, currentUser)}
          customDefinition={[
            {
              name: 'course',
              label: trans('course', {}, 'cursus'),
              type: 'training_course',
              filterable: true,
              sortable: true,
              displayed: 'desktop' === props.contextType,
              order: 1
            }, {
              name: 'session',
              label: trans('session', {}, 'cursus'),
              type: 'training_session',
              displayed: true,
              filterable: true,
              sortable: true,
              order: 1
            }, {
              name: 'session.status',
              type: 'choice',
              label: trans('status'),
              order: 2,
              displayable: false,
              sortable: false,
              filterable: true,
              options: {
                noEmpty: true,
                choices: {
                  not_started: trans('session_not_started', {}, 'cursus'),
                  in_progress: trans('session_in_progress', {}, 'cursus'),
                  ended: trans('session_ended', {}, 'cursus'),
                  not_ended: trans('session_not_ended', {}, 'cursus')
                }
              }
            }, {
              name: 'confirmed',
              label: trans('confirmed', {}, 'cursus'),
              type: 'boolean',
              displayed: constants.LEARNER_TYPE === props.type,
              filterable: true,
              sortable: true,
            }, {
              name: 'validated',
              label: trans('validated', {}, 'cursus'),
              type: 'boolean',
              displayed: constants.LEARNER_TYPE === props.type,
              filterable: true,
              sortable: true,
            }
          ]}
        />
      </PageContentList>
    </ToolPage>
  )
}

TrainingsSessionUsers.propTypes = {
  path: T.string.isRequired,
  contextType: T.string.isRequired,
  contextId: T.string,
  title: T.string.isRequired,
  type: T.string.isRequired,
  name: T.string.isRequired,
  canRegister: T.bool.isRequired
}

export {
  TrainingsSessionUsers
}
