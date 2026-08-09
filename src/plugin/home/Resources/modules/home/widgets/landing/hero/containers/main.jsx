import {connect} from 'react-redux'

import {selectors as contentSelectors} from '#/main/core/widget/content/store'
import {LandingHero as LandingHeroComponent} from '#/plugin/home/home/widgets/landing/hero/components/main'

const LandingHero = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(LandingHeroComponent)

export {
  LandingHero
}
