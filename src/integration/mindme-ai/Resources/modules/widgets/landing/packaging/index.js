import {LandingPackaging} from './components/main'
import {LandingPackagingParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingPackagingParameters
})

/**
 * Landing packaging widget application (mini-program / desktop / app).
 */
export const App = () => ({
  component: LandingPackaging,
  styles: ['claroline-distribution-integration-mindme-ai-landing']
})

export default declareWidget(LandingPackaging, LandingPackagingParameters)
