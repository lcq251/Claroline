/*
 * Product recommendations list store.
 *
 * Mounts a standard Claroline list reducer for the dashboard-recommendations
 * widget (route A: full ListData integration).
 */

import {reducer} from '#/integration/mindme-ai/widgets/dashboard/recommendations/store/reducer'
import {selectors} from '#/integration/mindme-ai/widgets/dashboard/recommendations/store/selectors'

export {
  reducer,
  selectors
}
