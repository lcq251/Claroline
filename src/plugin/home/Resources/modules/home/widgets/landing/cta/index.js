import {LandingCta} from './components/main'
import {LandingCtaParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingCtaParameters
})

/**
 * Landing CTA widget application (login / register only).
 */
export const App = () => ({
  component: LandingCta
})

export default declareWidget(LandingCta, LandingCtaParameters)
