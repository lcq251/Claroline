import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {LinkButton} from '#/main/app/buttons/link'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router/components/routes'
import {ContentInfoBlocks} from '#/main/app/content/components/info-block'
import {MODAL_USERS} from '#/main/community/modals/users'

import {selectors} from '#/plugin/cursus/course/store'
import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {constants} from '#/plugin/cursus/constants'
import {isFull} from '#/plugin/cursus/utils'

import {CourseStats} from '#/plugin/cursus/course/components/stats'
import {SessionUsers} from '#/plugin/cursus/session/containers/users'
import {ContentNav} from '#/main/app/content/components/nav'
import {Alert} from '#/main/app/components/alert'

const SessionParticipants = (props) =>
  <>
    <ContentInfoBlocks
      className="my-4"
      size="lg"
      items={[
        {
          icon: 'fa fa-chalkboard-teacher',
          label: trans('tutors', {}, 'cursus'),
          value: get(props.activeSession, 'participants.tutors', 0)
        }, {
          icon: 'fa fa-user',
          label: trans('users'),
          value: get(props.activeSession, 'participants.learners', 0)
        }, {
          icon: 'fa fa-hourglass-half',
          label: trans('pending'),
          value: get(props.activeSession, 'participants.pending', 0)
        }, {
          icon: 'fa fa-user-plus',
          label: trans('available_seats', {}, 'cursus'),
          value: get(props.activeSession, 'restrictions.users') ?
            (get(props.activeSession, 'restrictions.users') - get(props.activeSession, 'participants.learners', 0)) + ' / ' + get(props.activeSession, 'restrictions.users')
            : <span className="fa fa-fw fa-infinity" />
        }
      ]}
    />

    <div className="row">
      <div className="col-md-3">
        <ContentNav
          className="mb-3"
          path={props.path}
          type="horizontal"
          sections={[
            {
              icon: 'fa fa-fw fa-chalkboard-teacher',
              title: trans('tutors', {}, 'cursus'),
              path: '/',
              exact: true,
              subscript: {
                type: 'label',
                value: 10,
                status: 'primary'
              }
            }, {
              icon: 'fa fa-fw fa-user',
              title: trans('users', {}, 'community'),
              path: '/users'
            }, {
              icon: 'fa fa-fw fa-hourglass-half',
              title: trans('pending'),
              path: '/pending'
            }, {
              icon: 'fa fa-fw fa-pie-chart',
              title: trans('statistics'),
              path: '/stats'
            }
          ]}
        />
      </div>

      <div className="col-md-9">
        <Routes
          path={props.path}
          routes={[
            {
              path: '/',
              exact: true,
              render: () => (
                <SessionUsers
                  type={constants.TEACHER_TYPE}
                  course={props.course}
                  session={props.activeSession}
                  name={selectors.STORE_NAME+'.sessionTutors'}
                  add={{
                    name: 'add_users',
                    type: MODAL_BUTTON,
                    label: trans('add_tutors', {}, 'cursus'),
                    modal: [MODAL_USERS, {
                      selectAction: (selected) => ({
                        type: CALLBACK_BUTTON,
                        label: trans('register', {}, 'actions'),
                        callback: () => props.addUsers(props.activeSession.id, selected, constants.TEACHER_TYPE)
                      })
                    }]
                  }}
                />
              )
            }, {
              path: '/users',
              render: () => (
                <Fragment>
                  {isFull(props.activeSession) &&
                    <Alert type="warning" title={trans('session_full', {}, 'cursus')}>
                      {trans('session_full_help', {}, 'cursus')}
                    </Alert>
                  }

                  {get(props.activeSession, 'registration.userValidation') &&
                    <Alert title={trans('registration_user_confirmation_title', {}, 'cursus')}>
                      {trans('registration_user_confirmation_pending_help', {}, 'cursus')}
                      <br/>
                      {trans('registration_user_confirmation_manager_help', {}, 'cursus')}
                      (<LinkButton target={props.path+'/pending'}>{trans('show_pending_list', {}, 'cursus')}</LinkButton>)
                    </Alert>
                  }

                  <SessionUsers
                    type={constants.LEARNER_TYPE}
                    course={props.course}
                    session={props.activeSession}
                    name={selectors.STORE_NAME+'.sessionUsers'}
                    add={{
                      name: 'add_users',
                      type: MODAL_BUTTON,
                      label: trans('add_users', {}, 'actions'),
                      modal: [MODAL_USERS, {
                        selectAction: (selected) => ({
                          type: CALLBACK_BUTTON,
                          label: trans('register', {}, 'actions'),
                          callback: () => props.addUsers(props.activeSession.id, selected, constants.LEARNER_TYPE)
                        })
                      }]
                    }}
                  />
                </Fragment>
              )
            }, {
              path: '/pending',
              render: () => (
                <>
                  {isFull(props.activeSession) && hasPermission('register', props.activeSession) &&
                    <Alert type="warning" title={trans('session_full', {}, 'cursus')}>
                      {trans('session_full_pending_help', {}, 'cursus')}
                    </Alert>
                  }

                  <SessionUsers
                    type={constants.LEARNER_TYPE}
                    course={props.course}
                    session={props.activeSession}
                    name={selectors.STORE_NAME+'.sessionPending'}
                    customDefinition={[
                      {
                        name: 'confirmed',
                        type: 'boolean',
                        label: trans('confirmed'),
                        displayable: true,
                        displayed: false
                      }, {
                        name: 'validated',
                        type: 'boolean',
                        label: trans('validated'),
                        displayable: true,
                        displayed: false
                      }
                    ]}
                    add={{
                      name: 'add_users',
                      type: MODAL_BUTTON,
                      label: trans('add_pending', {}, 'cursus'),
                      modal: [MODAL_USERS, {
                        selectAction: (selected) => ({
                          type: CALLBACK_BUTTON,
                          label: trans('register', {}, 'actions'),
                          callback: () => props.addPending(props.activeSession.id, selected)
                        })
                      }]
                    }}
                  />
                </>
              )
            }, {
              path: '/stats',
              onEnter: () => props.loadStats(props.course.id, get(props.activeSession, 'id')),
              render: () => (
                <CourseStats
                  course={props.course}
                  stats={props.stats}
                />
              )
            }
          ]}
        />
      </div>
    </div>
  </>

SessionParticipants.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  stats: T.object,
  addUsers: T.func.isRequired,
  addPending: T.func.isRequired,
  loadStats: T.func.isRequired
}

export {
  SessionParticipants
}
