import {createSelector} from 'reselect'
import {selectors as formSelectors} from '#/main/app/content/form'

const STORE_NAME = 'userEditor'
const FORM_NAME = STORE_NAME+'.form'

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
