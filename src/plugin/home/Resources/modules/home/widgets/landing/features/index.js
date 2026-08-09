import {LandingFeatures} from './components/main'
import {LandingFeaturesParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingFeaturesParameters
})

/**
 * Landing features widget application (teacher tools / student learning / AI embedded platform).
 */
export const App = () => ({
  component: LandingFeatures,
  styles: ['claroline-distribution-plugin-home-landing']
})

export default declareWidget(LandingFeatures, LandingFeaturesParameters)
