import {LandingCta} from './containers/main'
import {LandingCtaParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingCtaParameters
})

/**
 * Landing CTA widget application (login / register only).
 *
 * `styles` loads the landing stylesheet through the theme system
 * (claroline-distribution-plugin-home-landing.css, built from landing.scss).
 */
export const App = () => ({
  component: LandingCta,
  styles: ['claroline-distribution-plugin-home-landing']
})

export default declareWidget(LandingCta, LandingCtaParameters)
