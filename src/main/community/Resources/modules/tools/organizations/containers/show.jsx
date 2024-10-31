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
    addUsers(organizationId, users) {
      dispatch(actions.addUsers(organizationId, users))
    },
    addManagers(organizationId, users) {
      dispatch(actions.addManagers(organizationId, users))
    },
    addGroups(organizationId, groups) {
      dispatch(actions.addGroups(organizationId, groups))
    },
    addWorkspaces(organizationId, workspaces) {
      dispatch(actions.addWorkspaces(organizationId, workspaces))
    }
  })
)(OrganizationShowComponent)

export {
  OrganizationShow
}
