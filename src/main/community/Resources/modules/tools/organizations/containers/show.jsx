import {connect} from 'react-redux'

import {selectors as formSelectors} from '#/main/app/content/form/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {OrganizationShow as OrganizationShowComponent} from '#/main/community/tools/organizations/components/show'
import {actions, selectors} from '#/main/community/tools/organizations/store'

const OrganizationShow = connect(
  state => ({
    path: toolSelectors.path(state),
    organization: formSelectors.data(formSelectors.form(state, selectors.FORM_NAME))
  }),
  dispatch => ({
    reload(id) {
      dispatch(actions.open(id, true))
    },
    addManagers(organizationId, users) {
      dispatch(actions.addManagers(organizationId, users))
    }
  })
)(OrganizationShowComponent)

export {
  OrganizationShow
}
