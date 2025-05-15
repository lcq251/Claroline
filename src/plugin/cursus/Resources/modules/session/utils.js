import {getActions as getPluginsActions, getDefaultAction as getPluginsDefaultAction} from '#/main/app/plugins'

function getActions(sessions, sessionsRefresher, path, currentUser, withDefault = false) {
  return getPluginsActions('training_session', sessions, sessionsRefresher, path, currentUser, withDefault)
}

function getDefaultAction(sessions, sessionsRefresher, path, currentUser = null) {
  return getPluginsDefaultAction('training_session', sessions, sessionsRefresher, path, currentUser)
}

function getRegistrationActions(sessions, sessionsRefresher, path, currentUser, withDefault = false) {
  return getPluginsActions('training_session_registration', sessions, sessionsRefresher, path, currentUser, withDefault)
}

function getRegistrationDefaultAction(sessions, sessionsRefresher, path, currentUser = null) {
  return getPluginsDefaultAction('training_session_registration', sessions, sessionsRefresher, path, currentUser)
}

export {
  getActions,
  getDefaultAction,
  getRegistrationActions,
  getRegistrationDefaultAction
}
