/*
 * dashboard-recommendations widget: recommended products (priced courses + resources).
 */

import {RecommendationsBlock} from './components/main'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({component: () => null})

export const App = () => ({
  component: RecommendationsBlock,
  styles: ['claroline-distribution-integration-mindme-dashboard']
})

export default declareWidget(RecommendationsBlock, () => null)
