import {getActions as getPluginsActions, getDefaultAction as getPluginsDefaultAction} from '#/main/app/plugins'

function getActions(evaluations, refresher, path, currentUser, withDefault = false) {
  return getPluginsActions('workspace_evaluation', evaluations, refresher, path, currentUser, withDefault)
}

function getDefaultAction(evaluation, refresher, path, currentUser = null) {
  return getPluginsDefaultAction('workspace_evaluation', evaluation, refresher, path, currentUser)
}

export {
  getActions,
  getDefaultAction
}
