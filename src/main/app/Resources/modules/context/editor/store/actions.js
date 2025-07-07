import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {actions as contextActions} from '#/main/app/context/store/actions'

import {selectors} from '#/main/app/context/editor/store/selectors'

export const CONTEXT_LOAD_AVAILABLE_TOOLS = 'CONTEXT_LOAD_AVAILABLE_TOOLS'

export const actions = {}

// refresh edited context in player
actions.refresh = (contextData) => contextActions.load(contextData)

// reload editor data
actions.reload = (contextData, tools) => formActions.reset(selectors.FORM_NAME, {data: contextData, tools: tools}, false)

actions.update = (value, propPath = null) => {
  if (propPath) {
    return formActions.updateProp(selectors.FORM_NAME, propPath, value)
  }

  return formActions.update(selectors.FORM_NAME, value)
}

actions.loadAvailableTools = makeActionCreator(CONTEXT_LOAD_AVAILABLE_TOOLS, 'tools')

actions.fetchAvailableTools = (contextName, contextId = null) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['claro_context_get_available_tools', {context: contextName, contextId: contextId ? contextId : 'null'}],
    success: (response) => dispatch(actions.loadAvailableTools(response))
  }
})
