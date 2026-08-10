import {createSelector} from 'reselect'

import {selectors as configSelectors} from '#/main/app/config/store/selectors'

const STORE_NAME = 'registration'
const FORM_NAME = `${STORE_NAME}.form`

const store = (state) => state[STORE_NAME]

const sso = (state) => configSelectors.param(state, 'authentication.sso', [])

const termOfService = createSelector(
  [store],
  (store) => store.termOfService
)

const options = createSelector(
  [store],
  (store) => store.options
)

export const selectors = {
  STORE_NAME,
  FORM_NAME,

  sso,
  termOfService,
  options
}
