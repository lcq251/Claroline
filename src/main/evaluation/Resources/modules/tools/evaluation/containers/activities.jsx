import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {EvaluationActivities as EvaluationActivitiesComponent} from '#/main/evaluation/tools/evaluation/components/activities'

const EvaluationActivities = connect(
  (state) => ({
    contextId: toolSelectors.contextId(state)
  })
)(EvaluationActivitiesComponent)

export {
  EvaluationActivities
}
