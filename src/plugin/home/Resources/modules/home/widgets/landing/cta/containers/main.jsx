import {connect} from 'react-redux'

import {selectors as contentSelectors} from '#/main/core/widget/content/store'
import {LandingCta as LandingCtaComponent} from '#/plugin/home/home/widgets/landing/cta/components/main'

const LandingCta = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(LandingCtaComponent)

export {
  LandingCta
}
