import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {TabCreationModal as TabCreationModalComponent} from '#/plugin/home/tools/home/editor/modals/creation/components/modal'
import {actions, reducer, selectors} from '#/plugin/home/tools/home/editor/modals/creation/store'

const TabCreationModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      currentContext: toolSelectors.context(state),
    }),
    (dispatch) => ({
      startCreation(tabType, position) {
        dispatch(actions.startCreation(tabType, position))
      },
      reset() {
        dispatch(actions.reset())
      }
    })
  )(TabCreationModalComponent)
)

export {
  TabCreationModal
}
