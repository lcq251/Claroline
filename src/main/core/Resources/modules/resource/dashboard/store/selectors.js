import {createSelector} from 'reselect'
import get from 'lodash/get'

import {selectors as resourceSelectors} from '#/main/core/resource/store/selectors'

const STORE_NAME = 'resourceDashboard'

const store = (state) => get(state, STORE_NAME)

/**
 * Get the path of the current resource editor.
 * Used to create additional routing in the editor.
 */
const path = createSelector(
  [resourceSelectors.path],
  (resourcePath) => resourcePath + '/dashboard'
)

export const selectors = {
  STORE_NAME,

  path
}
