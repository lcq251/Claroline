import {connect} from 'react-redux'

import {PlatformNav as PlatformNavComponent} from '#/main/app/platform/components/nav'
import {selectors} from '#/main/app/context/store'
import {selectors as platformSelectors} from '#/main/app/platform/store'

const PlatformNav = connect(
  (state) => ({
    currentContext: selectors.data(state),
    currentContextType: selectors.type(state),
    currentContextPath: selectors.path(state),
    availableContexts: platformSelectors.availableContexts(state),
    favoriteContexts: platformSelectors.favoriteContexts(state)
  })
)(PlatformNavComponent)

export {
  PlatformNav
}
