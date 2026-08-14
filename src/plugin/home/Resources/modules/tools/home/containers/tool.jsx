import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/reducer'
import {selectors as toolSelectors} from '#/main/core/tool'
import {selectors as platformSelectors} from '#/main/app/platform/store'

import {HomeTool as HomeToolComponent} from '#/plugin/home/tools/home/components/tool'
import {actions, reducer, selectors} from '#/plugin/home/tools/home/store'

const HomeTool = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      path: toolSelectors.path(state),
      loaded: toolSelectors.loaded(state),
      contextType: toolSelectors.contextType(state),
      favoriteContexts: platformSelectors.favoriteContexts(state),
      tabs: selectors.tabs(state),
    }),
    (dispatch) => ({
      setCurrentTab(tab) {
        dispatch(actions.setCurrentTab(tab))
      }
    })
  )(HomeToolComponent)
)

export {
  HomeTool
}
