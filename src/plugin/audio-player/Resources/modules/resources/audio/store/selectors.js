import {createSelector} from 'reselect'

const STORE_NAME = 'audio'

const store = (state) => state[STORE_NAME]

const resource = createSelector(
  [store],
  (store) => store.resource
)

export const selectors = {
  STORE_NAME,
  resource
}
