/*
 * dashboard-overview widget: 4-card stats overview.
 */

import {Overview} from './components/main'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({component: () => null})

export const App = () => ({
  component: Overview,
  styles: ['claroline-distribution-integration-mindme-ai-dashboard']
})

export default declareWidget(Overview, () => null)
