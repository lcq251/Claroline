import {connect} from 'react-redux'

import {PlatformMenu as PlatformMenuComponent} from '#/main/app/platform/menu/components/main'
import {selectors} from '#/main/app/context/store'
import {selectors as platformSelectors} from '#/main/app/platform/store'

const PlatformMenu = connect(
  (state) => ({
    currentContext: selectors.data(state),
    currentContextType: selectors.type(state),
    currentContextPath: selectors.path(state),
    availableContexts: platformSelectors.availableContexts(state),
    favoriteContexts: platformSelectors.favoriteContexts(state)
  })
)(PlatformMenuComponent)

export {
  PlatformMenu
}
