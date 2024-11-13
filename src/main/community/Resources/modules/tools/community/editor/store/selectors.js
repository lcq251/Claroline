import {createSelector} from 'reselect'
import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'

import {selectors as baseSelectors} from '#/main/core/tool/editor/store/selectors'

const FORM_NAME = baseSelectors.STORE_NAME
const form =  state => formSelectors.form(state, FORM_NAME)

const formProfile = createSelector(
  [form],
  (form) => formSelectors.value(form, 'profile')
)

export const selectors = {
  FORM_NAME,
  formProfile
}
