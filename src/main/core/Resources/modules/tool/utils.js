import {getActions as getPluginsActions, getApp, getApps} from '#/main/app/plugins'

import {constants} from '#/main/core/tool/constants'

function getTools(contextType) {
  if (constants.TOOL_ADMINISTRATION === contextType) {
    return getApps('administration')
  }

  return getApps('tools')
}

async function getTool(name, contextType) {
  if (constants.TOOL_ADMINISTRATION === contextType) {
    return getApp('administration', name)()
  }

  return getApp('tools', name)()
}

function getActions(tools, toolRefresher, path, currentUser = null, withDefault = false) {
  const actions = [
    getPluginsActions('tool', tools, toolRefresher, path, currentUser, withDefault)
  ]

  if (1 === tools.length) {
    // adds the custom actions of the tool
    actions.push(getPluginsActions(tools[0].name, tools, toolRefresher, path, currentUser, withDefault))
  }

  return Promise.all(actions).then((loadedActions) => loadedActions.reduce((current, acc) => acc.concat(current), []))
}

function getDefaultAction(tool, toolRefresher, path, currentUser = null) {
  return getActions([tool], toolRefresher, path, currentUser, true)
    // only get the default one
    .then(actions => actions.find(action => action.default))
}

export {
  getTools,
  getTool,
  getDefaultAction,
  getActions
}
