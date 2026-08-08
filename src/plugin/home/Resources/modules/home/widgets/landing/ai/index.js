import {LandingAi} from './components/main'
import {LandingAiParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingAiParameters
})

/**
 * Landing AI widget application (AI capabilities showcase).
 */
export const App = () => ({
  component: LandingAi
})

export default declareWidget(LandingAi, LandingAiParameters)
