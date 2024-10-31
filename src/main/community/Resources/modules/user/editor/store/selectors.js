import {selectors as formSelectors} from '#/main/app/content/form'
import {createSelector} from 'reselect'

const STORE_NAME = 'userEditor'
const FORM_NAME = STORE_NAME+'.form'

const store = (state) => state[STORE_NAME]

const user = (state) => formSelectors.data(formSelectors.form(state, FORM_NAME))

const userId = createSelector(
  [user],
  (user) => user ? user.id : null
)

export const selectors = {
  STORE_NAME,
  FORM_NAME,
  user,
  userId
}
