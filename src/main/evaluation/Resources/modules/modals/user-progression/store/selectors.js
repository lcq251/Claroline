import {createSelector} from 'reselect'
import get from 'lodash/get'

const STORE_NAME = 'userEvaluation'

const store = createSelector(
  [
    (state) => state,
    (state, formName) => formName
  ],
  (state, storeName) => get(state, storeName, {})
)

const loaded = createSelector(
  [store],
  (store) => store.loaded
)

const evaluation = createSelector(
  [store],
  (store) => store.evaluation
)

const progression = createSelector(
  [store],
  (store) => store.progression || []
)

export const selectors = {
  STORE_NAME,

  loaded,
  evaluation,
  progression
}
