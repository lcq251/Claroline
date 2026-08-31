/*
 * dashboard-overview widget: 4 coloured cards with progress bars.
 */

import {OverviewBlock} from './components/main'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({component: () => null})

export const App = () => ({
  component: OverviewBlock,
  styles: ['claroline-distribution-integration-mindme-dashboard']
})

export default declareWidget(OverviewBlock, () => null)