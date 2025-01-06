import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {CommunityDashboard as CommunityDashboardComponent} from '#/main/community/tools/community/dashboard/components/main'
import {actions, selectors} from '#/main/community/tools/community/dashboard/store'

const CommunityDashboard = connect(
  (state) => ({
    path: toolSelectors.path(state),
    contextId: toolSelectors.contextId(state),
    count: selectors.count(state)
  }),
  (dispatch) => ({
    fetch(contextId) {
      return dispatch(actions.fetch(contextId))
    }
  })
)(CommunityDashboardComponent)

export {
  CommunityDashboard
}
