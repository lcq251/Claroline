import get from 'lodash/get'

const STORE_NAME = 'evaluationDashboard'

const store = (state) => get(state, STORE_NAME)

export const selectors = {
  STORE_NAME,

  store
}
