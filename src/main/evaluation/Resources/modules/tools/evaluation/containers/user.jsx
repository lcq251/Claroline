import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {EvaluationUser as EvaluationUserComponent} from '#/main/evaluation/tools/evaluation/components/user'
import {selectors} from '#/main/evaluation/tools/evaluation/store'

const EvaluationUser = connect(
  (state) => ({
    path: toolSelectors.path(state),
    contextPath: toolSelectors.basePath(state),
    loaded: selectors.userLoaded(state),
    workspaceEvaluation: selectors.userWorkspaceEvaluation(state),
    resourceEvaluations: selectors.userResourceEvaluations(state)
  })
)(EvaluationUserComponent)

export {
  EvaluationUser
}
