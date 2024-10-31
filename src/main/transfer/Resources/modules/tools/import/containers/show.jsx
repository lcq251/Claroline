import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {actions as formActions} from '#/main/app/content/form/store'

import {selectors} from '#/main/transfer/tools/import/store'
import {ImportShow as ImportShowComponent} from '#/main/transfer/tools/import/components/show'

const ImportShow = connect(
  state => ({
    path: toolSelectors.path(state),
    importFile: selectors.importFile(state)
  }),
  (dispatch) => ({
    openForm(importFile) {
      dispatch(formActions.reset(selectors.FORM_NAME, importFile, false))
    }
  })
)(ImportShowComponent)

export {
  ImportShow
}
