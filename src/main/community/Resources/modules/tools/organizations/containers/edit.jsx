import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors as formSelectors} from '#/main/app/content/form/store'

import {actions, selectors} from '#/main/community/tools/organizations/store'
import {OrganizationEdit as OrganizationEditComponent} from '#/main/community/tools/organizations/components/edit'

const OrganizationEdit = connect(
  state => ({
    path: toolSelectors.path(state),
    organization: formSelectors.data(formSelectors.form(state, selectors.FORM_NAME))
  }),
  (dispatch) => ({
    reload(id) {
      dispatch(actions.open(id, true))
    }
  })
)(OrganizationEditComponent)

export {
  OrganizationEdit
}
