import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {OrganizationList as OrganizationListComponent} from '#/main/community/tools/organizations/components/list'
import {selectors} from '#/main/community/tools/organizations/store'

const OrganizationList = connect(
  (state) => ({
    path: toolSelectors.path(state),
    canCreate: selectors.canCreate(state)
  })
)(OrganizationListComponent)

export {
  OrganizationList
}