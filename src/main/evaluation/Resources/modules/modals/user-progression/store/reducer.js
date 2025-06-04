import {combineReducers, makeInstanceReducer, reduceReducers} from '#/main/app/store/reducer'

import {
  USER_PROGRESSION_LOAD,
  USER_PROGRESSION_RESET
} from '#/main/evaluation/modals/user-progression/store/actions'
import merge from 'lodash/merge'
import difference from 'lodash/difference'

const defaultState = {
  loaded: false,
  evaluation: null,
  progression: []
}

const baseReducer = {
  loaded: makeInstanceReducer(defaultState.loaded, {
    [USER_PROGRESSION_RESET]: () => false,
    [USER_PROGRESSION_LOAD]: () => true
  }),
  evaluation: makeInstanceReducer(defaultState.evaluation, {
    [USER_PROGRESSION_RESET]: () => null,
    [USER_PROGRESSION_LOAD]: (state, action) => action.evaluation
  }),
  progression: makeInstanceReducer(defaultState.progression, {
    [USER_PROGRESSION_RESET]: () => [],
    [USER_PROGRESSION_LOAD]: (state, action) => action.progression
  })
}

function makeEvaluationReducer(storeName) {
  const reducer = {}

  Object.keys(baseReducer).map(reducerName => {
    reducer[reducerName] = baseReducer[reducerName](storeName, defaultState[reducerName])
  })

  return combineReducers(reducer)
}

export {
  makeEvaluationReducer
}
