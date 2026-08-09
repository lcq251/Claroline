import {LandingHero} from './containers/main'
import {LandingHeroParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingHeroParameters
})

/**
 * Landing hero widget application (hero visual + AI 元年 narrative + seal).
 *
 * `styles` loads the landing stylesheet through the theme system
 * (claroline-distribution-plugin-home-landing.css, built from landing.scss).
 */
export const App = () => ({
  component: LandingHero,
  styles: ['claroline-distribution-plugin-home-landing']
})

export default declareWidget(LandingHero, LandingHeroParameters)
