import {createSelector} from 'reselect'

import {selectors as configSelectors} from '#/main/app/config/store/selectors'
import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'

const STORE_NAME = 'templates'

const store = (state) => state[STORE_NAME]

const templateTypes = createSelector(
  [store],
  (store) => store.templateTypes
)

const current = createSelector(
  [store],
  (store) => store.current
)

const templateType = createSelector(
  [current, templateTypes],
  (current, templateTypes) => {
    let found
    for (let key in templateTypes) {
      found = templateTypes[key].find(t => t.name === current)
      if (found) {
        break;
      }
    }

    return found
  }
)

const template = (state) => formSelectors.data(formSelectors.form(state, STORE_NAME+'.template'))

const templates = createSelector(
  [store],
  (store) => store.templates || []
)

const locales = (state) => {
  const current = currentLocale(state)
  return []
    .concat(configSelectors.param(state, 'locale.available'))
    .sort((a, b) => {
      if (a === current) {
        return -1
      } else if (b === current) {
        return 1
      }
      return 0
    })
}

const currentLocale = (state) => configSelectors.param(state, 'locale.current')

export const selectors = {
  STORE_NAME,

  store,
  templateTypes,
  templateType,
  template,
  templates,
  locales,
  currentLocale
}
