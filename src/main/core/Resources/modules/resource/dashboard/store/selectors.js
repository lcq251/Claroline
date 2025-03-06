import {createSelector} from 'reselect'

import {selectors as resourceSelectors} from '#/main/core/resource/store/selectors'

const STORE_NAME = 'resourceDashboard'

/**
 * Get the path of the current resource dashboard.
 * Used to create additional routing in the dashboard.
 */
const path = createSelector(
  [resourceSelectors.path],
  (resourcePath) => resourcePath + '/dashboard'
)

export const selectors = {
  STORE_NAME,
  path
}
