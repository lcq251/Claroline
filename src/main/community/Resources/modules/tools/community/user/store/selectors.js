import {createSelector} from 'reselect'

import {selectors as baseSelectors} from '#/main/community/tools/community/store/selectors'
import {selectors as formSelectors} from '#/main/app/content/form'

const LIST_NAME = baseSelectors.STORE_NAME + '.users.list'
const FORM_NAME = baseSelectors.STORE_NAME + '.users.current'

const store = createSelector(
  [baseSelectors.store],
  (store) => store.users
)

const limitReached = createSelector(
  [store],
  (store) => store.limitReached
)

const currentUser = (state) => formSelectors.data(formSelectors.form(state, FORM_NAME))

export const selectors = {
  LIST_NAME,
  FORM_NAME,

  limitReached,
  currentUser
}
