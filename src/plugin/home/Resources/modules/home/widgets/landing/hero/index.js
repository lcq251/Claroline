import {LandingHero} from './components/main'
import {LandingHeroParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: LandingHeroParameters
})

/**
 * Landing hero widget application (hero visual + AI 元年 narrative + seal).
 */
export const App = () => ({
  component: LandingHero
})

export default declareWidget(LandingHero, LandingHeroParameters)
