import cloneDeep from 'lodash/cloneDeep'

import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {SECURITY_USER_CHANGE} from '#/main/app/security/store/actions'
import {
  CONTEXT_OPEN,
  CONTEXT_LOAD,
  CONTEXT_NOT_FOUND,
  CONTEXT_SET_LOADED, CONTEXT_MENU_TOGGLE_OPEN, CONTEXT_MENU_TOGGLE_PIN
} from '#/main/app/context/store/actions'

import {TOOL_LOAD} from '#/main/core/tool/store'
import {PLATFORM_SET_CURRENT_ORGANIZATION} from '#/main/app/platform/store/actions'

const reducer = combineReducers({
  /**
   * The type of the current context (e.g. public, desktop, workspace, administration).
   *
   * @var string
   */
  type: makeReducer(null, {
    [CONTEXT_OPEN]: (state, action) => action.contextType
  }),

  /**
   * The optional identifier of the context.
   *
   * @var string
   */
  id: makeReducer(null, {
    [CONTEXT_OPEN]: (state, action) => action.contextId
  }),

  menuOpened: makeReducer(false, {
    [CONTEXT_MENU_TOGGLE_OPEN]: (state) => !state,
    [CONTEXT_MENU_TOGGLE_PIN]: () => false
  }),

  menuPined: makeReducer(false, {
    [CONTEXT_MENU_TOGGLE_PIN]: (state) => !state
  }),

  /**
   * Are the context data fully loaded ?
   */
  loaded: makeReducer(false, {
    [SECURITY_USER_CHANGE]: () => false,
    [PLATFORM_SET_CURRENT_ORGANIZATION]: () => false,
    [CONTEXT_OPEN]: () => false,
    [CONTEXT_LOAD]: () => true,
    [CONTEXT_NOT_FOUND]: () => true,
    [CONTEXT_SET_LOADED]: (state, action) => action.loaded
  }),
  notFound: makeReducer(false, {
    [CONTEXT_OPEN]: () => false,
    [CONTEXT_NOT_FOUND]: () => true
  }),
  accessErrors: makeReducer({}, {
    [CONTEXT_OPEN]: () => ({}),
    [CONTEXT_LOAD]: (state, action) => action.contextData.accessErrors || {}
  }),

  data: makeReducer({}, {
    [CONTEXT_OPEN]: () => ({}),
    [CONTEXT_LOAD]: (state, action) => action.contextData.data || {}
  }),

  impersonated: makeReducer(false, {
    [CONTEXT_OPEN]: () => false,
    [CONTEXT_LOAD]: (state, action) => action.contextData.impersonated || false
  }),

  /**
   * The list of current context roles owned by the authenticated user.
   */
  roles: makeReducer([], {
    [CONTEXT_OPEN]: () => [],
    [CONTEXT_LOAD]: (state, action) => action.contextData.roles || []
  }),

  /**
   * The list of current context organizations owned by the authenticated user.
   */
  organizations: makeReducer([], {
    [CONTEXT_OPEN]: () => [],
    [CONTEXT_LOAD]: (state, action) => action.contextData.organizations || []
  }),

  /**
   * The list of available tools in the context.
   */
  tools: makeReducer([], {
    [CONTEXT_OPEN]: () => [],
    [CONTEXT_LOAD]: (state, action) => action.contextData.tools || [],
    [TOOL_LOAD]: (state, action) => {
      const toolPos = state.findIndex(tool => tool.name === action.toolName)
      if (-1 !== toolPos) {
        const newState = cloneDeep(state)
        newState[toolPos] = action.toolData.data

        return newState
      }

      return state
    }
  })
})

export {
  reducer
}
