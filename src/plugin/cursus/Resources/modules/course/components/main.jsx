import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {Routes} from '#/main/app/router'

import {route} from '#/plugin/cursus/course/routing'
import {CoursePage} from '#/plugin/cursus/course/components/page'
import {CourseDetails} from '#/plugin/cursus/course/components/details'
import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'

const Course = (props) =>
  <CoursePage
    path={props.path}
    course={props.course}
  >
    <Routes
      path={props.course ? route(props.course, null, props.path) : props.path}
      routes={[
        {
          path: '/:id?',
          onEnter: (params = {}) => {
            if (params.id) {
              props.openSession(params.id)
            } else {
              props.openSession(get(props.defaultSession, 'id') || null)
            }
          },
          render: () => (
            <CourseDetails
              contextType={props.contextType}
              path={props.path}
              course={props.course}
              activeSession={props.activeSession}
              availableSessions={props.availableSessions}
              registrations={props.registrations}
              reload={props.reload}
              register={(course, sessionId = null, registrationData = null) => {
                props.register(course, sessionId, registrationData).then(() => {
                  props.reload(course.slug)

                  if (!isEmpty(sessionId)) {
                    props.history.push(route(course, {id: sessionId}, props.path))
                  }
                })
              }}
              stats={props.stats}
              loadStats={props.loadStats}
            />
          )
        }
      ]}
    />
  </CoursePage>

Course.propTypes = {
  path: T.string.isRequired,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ),
  defaultSession: T.shape(
    SessionTypes.propTypes
  ),
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  availableSessions: T.arrayOf(T.shape(
    SessionTypes.propTypes
  )),
  registrations: T.arrayOf(T.shape({
    // SessionUser
  })),
  contextType: T.string.isRequired,
  openSession: T.func.isRequired,
  reload: T.func.isRequired,
  register: T.func.isRequired
}

export {
  Course
}
