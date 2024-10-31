import {connect} from 'react-redux'

import {selectors as formSelectors} from '#/main/app/content/form/store'

import {selectors} from '#/main/privacy/administration/privacy/store'
import {actions} from '#/main/privacy/administration/privacy/modals/terms-of-service/store'
import {EditorModal as EditorModalComponent} from '#/main/privacy/administration/privacy/modals/terms-of-service/components/modal'

const EditorModal = connect(
  (state) => ({
    formData: formSelectors.data(formSelectors.form(state, selectors.FORM_NAME))
  }),
  (dispatch) => ({
    save(data) {
      dispatch(actions.saveForm(data))
    }
  })
)(EditorModalComponent)

export {
  EditorModal
}
