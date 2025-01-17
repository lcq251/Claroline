import {createSelector} from 'reselect'
import get from 'lodash/get'

const STORE_NAME = 'evaluationDashboard'

const store = (state) => get(state, STORE_NAME)

const user = createSelector(
  [store],
  (store) => store.user
)

const userLoaded = createSelector(
  [user],
  (user) => user.loaded
)

const userWorkspaceEvaluation = createSelector(
  [user],
  (user) => user.workspaceEvaluation
)

const userResourceEvaluations = createSelector(
  [user],
  (user) => user.resourceEvaluations
)

export const selectors = {
  STORE_NAME,
  store,
  userLoaded,
  userWorkspaceEvaluation,
  userResourceEvaluations
}
