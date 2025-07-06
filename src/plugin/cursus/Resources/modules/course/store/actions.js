import isEmpty from 'lodash/isEmpty'

import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

import {selectors} from '#/plugin/cursus/course/store/selectors'

export const LOAD_COURSE = 'LOAD_COURSE'
export const LOAD_COURSE_SESSION = 'LOAD_COURSE_SESSION'
export const LOAD_COURSE_STATS = 'LOAD_COURSE_STATS'

export const actions = {}

actions.loadCourse = makeActionCreator(LOAD_COURSE, 'course', 'defaultSession', 'availableSessions', 'registrations')
actions.loadSession = makeActionCreator(LOAD_COURSE_SESSION, 'session')
actions.loadStats = makeActionCreator(LOAD_COURSE_STATS, 'stats')

actions.open = (courseSlug, force = false) => (dispatch, getState) => {
  const currentCourse = selectors.course(getState())
  if (force || isEmpty(currentCourse) || currentCourse.slug !== courseSlug) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_cursus_course_open', {slug: courseSlug}],
        silent: true,
        before: () => dispatch(actions.loadCourse(null, null, [], [])),
        success: (data) => dispatch(actions.loadCourse(data.course, data.defaultSession, data.availableSessions, data.registrations))
      }
    })
  }
}

actions.openSession = (sessionId = null, force = false) => (dispatch, getState) => {
  if (sessionId) {
    const currentSession = selectors.activeSession(getState())
    if (force || isEmpty(currentSession) || currentSession.id !== sessionId) {
      return dispatch({
        [API_REQUEST]: {
          url: ['apiv2_cursus_session_get', {id: sessionId}],
          success: (data) => {
            dispatch(actions.loadSession(data))
          }
        }
      })
    }
  } else {
    dispatch(actions.loadSession(null))
  }
}

// Sessions registration management

actions.addUsers = (sessionId, users, type) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_session_add_users', {id: sessionId, type: type}],
    request: {
      method: 'PATCH',
      body: JSON.stringify(users.map(user => user.id))
    }
  }
})

actions.register = (course, sessionId = null, registrationData = null) => ({
  [API_REQUEST]: {
    url: sessionId ?
      ['apiv2_cursus_session_self_register', {id: sessionId}] :
      ['apiv2_cursus_course_self_register', {id: course.id}],
    request: {
      method: 'PUT',
      body: registrationData ? JSON.stringify(registrationData) : null
    }
  }
})

actions.fetchStats = (courseId, sessionId = null) => (dispatch) => dispatch({
  [API_REQUEST]: {
    silent: true,
    url: sessionId ?
      ['apiv2_cursus_session_stats', {id: sessionId}] :
      ['apiv2_cursus_course_stats', {id: courseId}],
    success: (response) => dispatch(actions.loadStats(response))
  }
})
