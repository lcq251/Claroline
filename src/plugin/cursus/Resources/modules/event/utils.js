import {getActions as getPluginsActions, getDefaultAction as getPluginsDefaultAction} from '#/main/app/plugins'

function getActions(sessions, sessionsRefresher, path, currentUser, withDefault = false) {
  return getPluginsActions('training_event', sessions, sessionsRefresher, path, currentUser, withDefault)
}

function getDefaultAction(sessions, sessionsRefresher, path, currentUser = null) {
  return getPluginsDefaultAction('training_event', sessions, sessionsRefresher, path, currentUser)
}

function getRegistrationActions(registrations, registrationsRefresher, path, currentUser, withDefault = false) {
  return getPluginsActions('training_event_registration', registrations, registrationsRefresher, path, currentUser, withDefault)
}

function getRegistrationDefaultAction(registrations, registrationsRefresher, path, currentUser = null) {
  return getPluginsDefaultAction('training_event_registration', registrations, registrationsRefresher, path, currentUser)
}

export {
  getActions,
  getDefaultAction,
  getRegistrationActions,
  getRegistrationDefaultAction
}
