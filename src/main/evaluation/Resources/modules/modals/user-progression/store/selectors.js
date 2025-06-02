import {createSelector} from 'reselect'

const STORE_NAME = 'userEvaluation'

const store = (state) => state[STORE_NAME] || {}

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
