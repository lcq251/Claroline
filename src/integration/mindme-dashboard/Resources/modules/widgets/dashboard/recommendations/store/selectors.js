/*
 * Product recommendations list selectors.
 *
 * NB. STORE_NAME must be a flat key (no dots) — withReducer mounts the
 * reducer at the store root via lodash `set`, and a dotted key would be
 * split into a nested object and break combineReducers.
 */

const STORE_NAME = 'mindme_product_recommendations'

export const selectors = {
  STORE_NAME
}
