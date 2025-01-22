import cloneDeep from 'lodash/cloneDeep'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {
  SEQUENCE_RELOAD,
  STEP_ENABLE_NAVIGATION,
  STEP_DISABLE_NAVIGATION,
  SEQUENCE_EVALUATION_UPDATE,
  STEP_UPDATE_PROGRESSION
} from '#/main/evaluation/sequence/store/actions'
import {makeFetchReducer} from '#/main/app/api/fetch/store'

import {selectors} from '#/main/evaluation/sequence/store/selectors'

const reducer = makeFetchReducer(selectors.STORE_NAME, {
  data: {
    sequence: null,
    userEvaluation: null,
    resourceEvaluations: []
  }
}, {
  data: combineReducers({
    sequence: makeReducer(null, {
      [SEQUENCE_RELOAD]: (state, action) => action.sequence
    }),
    userEvaluation: makeReducer([], {
      [SEQUENCE_EVALUATION_UPDATE]: (state, action) => action.userEvaluation || state,
    }),
    // the list of evaluation for the embedded required resources
    resourceEvaluations: makeReducer([], {
      [SEQUENCE_EVALUATION_UPDATE]: (state, action) => action.resourceEvaluations || state,
    }),
    stepsProgression: makeReducer({}, {
      [STEP_UPDATE_PROGRESSION]: (state, action) => {
        const newState = cloneDeep(state)

        newState[action.stepId] = action.status

        return newState
      }
    })
  }),
  navigationEnabled: makeReducer(true, {
    [STEP_ENABLE_NAVIGATION]: () => true,
    [STEP_DISABLE_NAVIGATION]: () => false
  }),
})

export {
  reducer
}
