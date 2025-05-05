import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {
  SEQUENCE_RELOAD,
  SEQUENCE_SET_CURRENT_STEP,
  SEQUENCE_ENABLE_NAVIGATION,
  SEQUENCE_DISABLE_NAVIGATION,
  SEQUENCE_EVALUATION_UPDATE
} from '#/main/evaluation/sequence/store/actions'
import {makeFetchReducer} from '#/main/app/api/fetch/store'

import {selectors} from '#/main/evaluation/sequence/store/selectors'

const reducer = makeFetchReducer(selectors.STORE_NAME, {
  data: {
    sequence: null,
    userEvaluation: null,
    progression: []
  }
}, {
  data: combineReducers({
    sequence: makeReducer(null, {
      [SEQUENCE_RELOAD]: (state, action) => action.sequence
    }),
    userEvaluation: makeReducer([], {
      [SEQUENCE_EVALUATION_UPDATE]: (state, action) => action.userEvaluation || state,
    }),
    progression: makeReducer([], {
      [SEQUENCE_EVALUATION_UPDATE]: (state, action) => action.progression || state,
    })
  }),
  currentStep: makeReducer(null, {
    [SEQUENCE_SET_CURRENT_STEP]: (state, action) => action.stepSlug
  }),
  navigationEnabled: makeReducer(true, {
    [SEQUENCE_ENABLE_NAVIGATION]: () => true,
    [SEQUENCE_DISABLE_NAVIGATION]: () => false
  }),
})

export {
  reducer
}
