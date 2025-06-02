import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {
  USER_PROGRESSION_LOAD,
  USER_PROGRESSION_RESET
} from '#/main/evaluation/modals/user-progression/store/actions'

const reducer = combineReducers({
  loaded: makeReducer(false, {
    [USER_PROGRESSION_RESET]: () => false,
    [USER_PROGRESSION_LOAD]: () => true
  }),
  evaluation: makeReducer(null, {
    [USER_PROGRESSION_RESET]: () => null,
    [USER_PROGRESSION_LOAD]: (state, action) => action.evaluation
  }),
  progression: makeReducer([], {
    [USER_PROGRESSION_RESET]: () => [],
    [USER_PROGRESSION_LOAD]: (state, action) => action.progression
  })
})

export {
  reducer
}
