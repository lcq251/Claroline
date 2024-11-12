import {createSelector} from 'reselect'

import {selectors as configSelectors} from '#/main/app/config/store/selectors'
import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'

const STORE_NAME = 'templates'

const store = (state) => state[STORE_NAME]

const templateTypes = createSelector(
  [store],
  (store) => store.templateTypes
)

const currentTemplate = createSelector(
  [store],
  (store) => store.current || {}
)

const templateType = createSelector(
  [currentTemplate],
  (currentTemplate) => currentTemplate.type
)

const template = (state) => formSelectors.data(formSelectors.form(state, STORE_NAME+'.template'))

const templates = createSelector(
  [currentTemplate],
  (currentTemplate) => currentTemplate && currentTemplate.templates ? currentTemplate.templates : []
)

const locales = (state) => configSelectors.param(state, 'locale.available')

const defaultLocale = (state) => configSelectors.param(state, 'locale.current')

export const selectors = {
  STORE_NAME,

  store,
  templateTypes,
  templateType,
  template,
  templates,
  locales,
  defaultLocale
}
