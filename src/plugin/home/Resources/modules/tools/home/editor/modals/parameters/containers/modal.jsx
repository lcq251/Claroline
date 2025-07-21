import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {ParametersModal as ParametersModalComponent} from '#/plugin/home/tools/home/editor/modals/parameters/components/modal'
import {reducer, selectors} from '#/plugin/home/tools/home/editor/modals/parameters/store'

const ParametersModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      currentContext: toolSelectors.context(state)
    }),
    (dispatch) => ({
      loadTab(tab) {
        dispatch(formActions.resetForm(selectors.STORE_NAME, tab))
      }
    })
  )(ParametersModalComponent)
)

export {
  ParametersModal
}
