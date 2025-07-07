import {selectors as formSelectors} from '#/main/app/content/form'

const STORE_NAME = 'courseEditor'
const FORM_NAME = STORE_NAME+'.form'

const course = (state) => formSelectors.data(formSelectors.form(state, FORM_NAME))

export const selectors = {
  STORE_NAME,
  FORM_NAME,

  course
}
