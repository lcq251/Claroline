import {param} from '#/main/app/config'
import {getActions as getPluginsActions} from '#/main/app/plugins'

function getTypes() {
  return param('resources.types')
}

/**
 * Get the type implemented by a resource node.
 *
 * @param {object} resourceNode
 *
 * @return {object}
 */
function getType(resourceNode) {
  return param('resources.types')
    .find(type => type.name === resourceNode.meta.type)
}

function supportEvaluation(resourceNode) {
  const resourceType = getType(resourceNode)

  return !!resourceType && resourceType.evaluation
}

function supportDownload(resourceNode) {
  const resourceType = getType(resourceNode)

  return !!resourceType && resourceType.downloadable
}

/**
 * Gets the list of available actions for a resource.
 *
 * @param {Array}   resourceNodes   - the current resource node(s)
 * @param {object}  nodesRefresher  - an object containing methods to update the node context
 * @param {string}  path            - the UI path where the resource is opened
 * @param {object}  currentUser     - the authenticated user
 * @param {boolean} withDefault     - include the default action (most of the time, it's not useful to get it)
 *
 * @return {Promise.<Array>}
 */
function getActions(resourceNodes, nodesRefresher, path, currentUser = null, withDefault = false) {
  return Promise.all([
    getPluginsActions('resource', resourceNodes, nodesRefresher, path, currentUser, withDefault),
    // getPluginsActions(contextName, resourceNodes, nodesRefresher, path, currentUser, withDefault)
  ]).then((loadedActions) => loadedActions.reduce((current, acc) => acc.concat(current), []))
}

/**
 * Gets the default action of a resource.
 *
 * @param {object} resourceNode   - the current resource node
 * @param {object} nodesRefresher - an object containing methods to update the node context
 * @param {string} path           - the UI path where the resource is opened
 * @param {object} currentUser    - the authenticated user
 *
 * @return {Promise.<object>}
 */
function getDefaultAction(resourceNode, nodesRefresher, path, currentUser = null) {
  return getActions([resourceNode], resourceNode, path, currentUser, true)
    // only get the default one
    .then(actions => actions.find(action => action.default))
}

export {
  getType,
  getTypes,
  supportEvaluation,
  supportDownload,
  getActions,
  getDefaultAction
}
