import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store/reducer'
import {TOOL_LOAD, TOOL_OPEN} from '#/main/core/tool/store'

import {selectors} from '#/main/evaluation/tools/evaluation/store/selectors'
import {CONTEXT_OPEN} from '#/main/app/context/store/actions'
import {makeInstanceAction} from '#/main/app/store/actions'

const reducer = combineReducers({
  current: combineReducers({
    sequences: makeReducer([], {
      [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.sequences
    }),
    workspaceEvaluation: makeReducer(null, {
      [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => {
        return action.toolData.workspaceEvaluation
      }
    }),
    resourceEvaluations: makeReducer([], {
      [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: (state, action) => action.toolData.resourceEvaluations
    })
  }),

  sequences: makeListReducer(selectors.STORE_NAME+'.sequences', {
    sortBy: {property: 'name', direction: 1}
  }, {
    loaded: makeReducer(false, {
      [CONTEXT_OPEN]: () => false
    }),
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true
    })
  }),

  requiredResources: makeListReducer(selectors.STORE_NAME+'.requiredResources', {}, {
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
