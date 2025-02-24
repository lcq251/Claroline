import {connect} from 'react-redux'

import {selectors as securitySelectors} from '#/main/app/security/store'
import {actions as listActions} from '#/main/app/content/list/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {EvaluationDashboardEvaluations as EvaluationDashboardEvaluationsComponent} from '#/main/evaluation/tools/evaluation/dashboard/components/evaluations'
import {selectors} from '#/main/evaluation/tools/evaluation/store'

const EvaluationDashboardEvaluations = connect(
  (state) => ({
    path: toolSelectors.path(state),
    currentUser: securitySelectors.currentUser(state),
    contextId: toolSelectors.contextId(state),
    hasScore: selectors.hasScore(state),
    totalScore: selectors.totalScore(state)
  }),
  (dispatch) => ({
    invalidate() {
      dispatch(listActions.invalidateData(selectors.STORE_NAME + '.workspaceEvaluations'))
    }
  })
)(EvaluationDashboardEvaluationsComponent)

export {
  EvaluationDashboardEvaluations
}
