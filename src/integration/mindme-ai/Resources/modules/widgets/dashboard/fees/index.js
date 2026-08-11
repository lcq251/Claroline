import {Fees} from './components/main'
import {FeesParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: FeesParameters
})

/**
 * Desktop dashboard fees widget (course fees + income/cost card, C-22).
 */
export const App = () => ({
  component: Fees,
  styles: ['claroline-distribution-integration-mindme-ai-dashboard']
})

export default declareWidget(Fees, FeesParameters)
