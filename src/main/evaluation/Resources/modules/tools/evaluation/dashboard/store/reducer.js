import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store/reducer'

import {TOOL_OPEN} from '#/main/core/tool/store'
import {CONTEXT_OPEN} from '#/main/app/context/store/actions'

import {selectors} from '#/main/evaluation/tools/evaluation/dashboard/store/selectors'

const reducer = combineReducers({
  /**
   * The list of all workspace evaluations for all users.
   * It is filtered by workspace for the ws tool.
   */
  workspaceEvaluations: makeListReducer(selectors.STORE_NAME+'.workspaceEvaluations', {
    sortBy: { property: 'lastActivityAt', direction: -1 }
  }, {
    loaded: makeReducer(false, {
      [CONTEXT_OPEN]: () => false
    }),
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true
    })
  })
})

export {
  reducer
}
