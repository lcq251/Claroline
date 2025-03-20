import {getActions as getPluginsActions, getDefaultAction as getPluginsDefaultAction} from '#/main/app/plugins'

function getActions(badges, badgesRefresher, path, currentUser, withDefault = false) {
  return getPluginsActions('badge_assertion', badges, badgesRefresher, path, currentUser, withDefault)
}

function getDefaultAction(badges, badgesRefresher, path, currentUser = null) {
  return getPluginsDefaultAction('badge_assertion', badges, badgesRefresher, path, currentUser)
}

export {
  getActions,
  getDefaultAction
}
