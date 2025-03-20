import {createSelector} from 'reselect'
import get from 'lodash/get'

const STORE_NAME = 'badges'

const FORM_NAME = `${STORE_NAME}.current`
const LIST_NAME = `${STORE_NAME}.list`

const store = (state) => state[STORE_NAME]

const assertion = createSelector(
  [store],
  (store) => get(store, 'current.myAssertion')
)

export const selectors = {
  STORE_NAME,
  FORM_NAME,
  LIST_NAME,

  assertion
}
