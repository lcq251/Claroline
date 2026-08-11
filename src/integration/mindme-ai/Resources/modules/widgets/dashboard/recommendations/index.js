import {Recommendations} from './components/main'
import {RecommendationsParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: RecommendationsParameters
})

/**
 * Desktop dashboard recommendations widget (hand-picked items, C-22).
 */
export const App = () => ({
  component: Recommendations,
  styles: ['claroline-distribution-integration-mindme-ai-dashboard']
})

export default declareWidget(Recommendations, RecommendationsParameters)
