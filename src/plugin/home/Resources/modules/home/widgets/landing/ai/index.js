import {LandingAi} from './components/main'
import {LandingAiParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingAiParameters
})

/**
 * Landing AI widget application (AI capabilities showcase).
 *
 * `styles` loads the landing stylesheet through the theme system
 * (claroline-distribution-plugin-home-landing.css, built from landing.less).
 */
export const App = () => ({
  component: LandingAi,
  styles: ['claroline-distribution-plugin-home-landing']
})

export default declareWidget(LandingAi, LandingAiParameters)
