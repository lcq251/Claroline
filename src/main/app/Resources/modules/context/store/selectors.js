import {createSelector} from 'reselect'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'

import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl'

const STORE_NAME = 'context'
const EDITOR_NAME = 'contextEditor'

/**
 * Root of the context store.
 */
const store = (state) => state[STORE_NAME] || {}

/**
 * Get the context type.
 *
 * @return string
 */
const type = createSelector(
  [store],
  (store) => store.type
)

/**
 * Get the context id.
 *
 * @return string|null
 */
const id = createSelector(
  [store],
  (store) => store.id
)

const path = createSelector(
  [type, id],
  (type, id) => id ? `/${type}/${id}` : `/${type}`
)

const menuOpened = createSelector(
  [store],
  (store) => store.menuOpened
)

const menuPined = createSelector(
  [store],
  (store) => store.menuPined
)

const data = createSelector(
  [store],
  (store) => store.data
)

/**
 * Is the context fully loaded ?
 *
 * @return bool
 */
const loaded = createSelector(
  [store],
  (store) => store.loaded
)

/**
 * Is context not found ?
 *
 * @return bool
 */
const notFound = createSelector(
  [store],
  (store) => store.notFound
)

/**
 * Get the list of all access errors to the context.
 *
 * @return object
 */
const accessErrors = createSelector(
  [store],
  (store) => store.accessErrors
)

const hasErrors = createSelector(
  [accessErrors],
  (accessErrors) => !isEmpty(accessErrors)
)

/**
 * Can the current user manage the context ?
 *
 * @return bool
 */
const managed = createSelector(
  [data],
  (data) => hasPermission('administrate', data)
)

/**
 * Does the current user impersonate some user/role ?
 *
 * @return bool
 */
const impersonated = createSelector(
  [store],
  (store) => store.impersonated
)

/**
 * Get the list of current user's roles for the context.
 */
const roles = createSelector(
  [store],
  (store) => store.roles || []
)

const organizations = createSelector(
  [store],
  (store) => [].concat(store.organizations || [])
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1
      }

      return -1
    })
)

const tools = createSelector(
  [store],
  (store) => store.tools || []
)

const accessibleTools = createSelector(
  [tools],
  (tools) => [].concat(tools)
    .filter(tool => hasPermission('open', tool))
    .sort((a, b) => {
      if (isNumber(a.order) && isNumber(b.order) && a.order !== b.order) {
        return a.order - b.order
      }

      if (trans(a.name, {}, 'tools') > trans(b.name, {}, 'tools')) {
        return 1
      }

      return -1
    })
)

const visibleTools = createSelector(
  [accessibleTools],
  (accessibleTools) => accessibleTools.filter(tool => !get(tool, 'restrictions.hidden', false))
)

const defaultOpening = createSelector(
  [data, tools],
  (data, tools) => {
    let defaultTool = null
    if (data && get(data, 'opening.type')) {
      if ('resource' === get(data, 'opening.type')) {
        defaultTool = `resources/${data.opening.target.slug || ''}`
      } else if ('tool' === data.opening.type) {
        defaultTool = data.opening.target
      }
    }

    // no opening config for the current context, just get the first available tool
    if (!isEmpty(tools)) {
      if (!defaultTool || -1 === tools.findIndex(tool => defaultTool === tool.name)) {
        // no default set or the default tool is not available for the user
        // open the first available tool
        defaultTool = tools[0].name
      }
    }

    return defaultTool
  }
)

export const selectors = {
  STORE_NAME,
  EDITOR_NAME,

  type,
  id,
  path,

  // selectors for menu
  menuOpened,
  menuPined,

  // selectors for context statuses
  loaded,
  notFound,
  accessErrors,
  hasErrors,

  // selectors for context security
  impersonated,
  managed,
  roles,
  organizations,

  // selectors for context config
  data,
  tools,
  accessibleTools,
  visibleTools,
  defaultOpening
}
