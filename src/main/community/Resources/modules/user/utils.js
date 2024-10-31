import {getApps, getActions as getPluginsActions, getDefaultAction as getPluginsDefaultAction} from '#/main/app/plugins'

function getActions(users, usersRefresher, path, currentUser, withDefault = false) {
  return getPluginsActions('user', users, usersRefresher, path, currentUser, withDefault)
}

function getDefaultAction(user, usersRefresher, path, currentUser = null) {
  return getPluginsDefaultAction('user', user, usersRefresher, path, currentUser)
}

function getAccount() {
  // get all sections declared for account
  const apps = getApps('account')

  return Promise.all(
    // boot actions applications
    Object.keys(apps).map(app => apps[app]())
  ).then(loadedApps => loadedApps
    .map(appModule => appModule.default)
  )
}

function getProfile() {
  // get all sections declared for account
  const apps = getApps('profile')

  return Promise.all(
    // boot actions applications
    Object.keys(apps).map(app => apps[app]())
  ).then(loadedApps => loadedApps
    .map(appModule => appModule.default)
  )
}

export {
  getAccount,
  getActions,
  getDefaultAction,
  getProfile
}
