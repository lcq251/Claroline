import identity from 'lodash/identity'

import {getActions as getPluginsActions, getApp, getApps} from '#/main/app/plugins'

import {constants} from '#/main/core/tool/constants'
import merge from 'lodash/merge'

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
  return getPluginsActions('tool', tools, toolRefresher, path, currentUser, withDefault)
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
