import {registry} from '#/main/app/plugins/registry'
import {getApps, getApp, isAppEnabled} from '#/main/app/plugins/app'
import {getActions, getDefaultAction} from '#/main/app/plugins/action'

function declarePlugin(pluginName, registeredApps = {}) {
  registry.add(pluginName, registeredApps)
}

export {
  declarePlugin,
  getApps,
  getApp,
  isAppEnabled,

  getActions,
  getDefaultAction
}
