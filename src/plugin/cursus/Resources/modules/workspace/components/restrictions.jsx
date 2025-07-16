import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'

import {Router, Routes} from '#/main/app/router'
import {PageContent} from '#/main/app/page'
import {Workspace} from '#/main/core/workspace/prop-types'

import {CourseDetails} from '#/plugin/cursus/course/components/details'
import {route} from '#/plugin/cursus/course/routing'
import {actions} from '#/plugin/cursus/course/store'

const TrainingWorkspaceRestrictions = (props) => {
  const dispatch = useDispatch()

  const course = get(props.errors, 'trainings.course')
  const defaultSession = get(props.errors, 'trainings.defaultSession')
  const availableSessions = get(props.errors, 'trainings.availableSessions')
  const registrations = get(props.errors, 'trainings.registrations')

  const [activeSession, setActiveSession] = useState(defaultSession || null)

  return (
    <PageContent poster={get(course, 'poster')}>
      <Router embedded={true} basename={route(course, null, props.path)}>
        <Routes
          path={route(course, null, props.path)}
          routes={[
            {
              path: '/:id?',
              onEnter: (params = {}) => {
                if (params.id) {
                  setActiveSession(availableSessions.find(session => session.id === params.id))
                } else {
                  setActiveSession(defaultSession || null)
                }
              },
              render: () => (
                <CourseDetails
                  contextType="workspace"
                  path={props.path}
                  course={course}
                  activeSession={activeSession}
                  availableSessions={availableSessions}
                  registrations={registrations}
                  register={(course, sessionId = null, registrationData = null) => {
                    dispatch(actions.register(course, sessionId, registrationData).then(() => {
                      window.location.reload()
                    }))
                  }}
                />
              )
            }
          ]}
        />
      </Router>
    </PageContent>
  )
}

TrainingWorkspaceRestrictions.propTypes = {
  path: T.string.isRequired,
  workspace: T.shape(
    Workspace.propTypes
  ).isRequired,
  errors: T.object.isRequired,
}

export {
  TrainingWorkspaceRestrictions
}
