import {createSelector} from 'reselect'

const STORE_NAME = 'workspaceUserEvaluation'

const store = (state) => state[STORE_NAME]

const workspaceEvaluation = createSelector(
  [store],
  (store) => store.workspaceEvaluation
)

const resourceEvaluations = createSelector(
  [store],
  (store) => store.resourceEvaluations
)

export const selectors = {
  STORE_NAME,

  workspaceEvaluation,
  resourceEvaluations
}
