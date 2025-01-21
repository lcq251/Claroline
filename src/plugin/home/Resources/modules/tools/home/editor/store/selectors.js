
import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'
import {selectors as baseSelectors} from '#/main/core/tool/editor/store/selectors'

const FORM_NAME = baseSelectors.STORE_NAME

const tabs = (state) => {
  return [].concat(formSelectors.data(formSelectors.form(state, FORM_NAME)).tabs || [])
    // .sort((a, b) => a.position - b.position)
}

const errors = (state) => formSelectors.errors(formSelectors.form(state, FORM_NAME))

export const selectors = {
  FORM_NAME,

  tabs,
  errors
}
