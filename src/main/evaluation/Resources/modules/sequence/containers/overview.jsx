import {connect} from 'react-redux'

import {selectors as resourceSelectors} from '#/main/core/resource/store/selectors'

import {PathOverview as PathOverviewComponent} from '#/main/evaluation/sequence/components/overview'
import {selectors} from '#/main/evaluation/sequence/store'

const PathOverview = connect(
  (state) => ({
    // basePath: resourceSelectors.path(state),
    // path: selectors.path(state),
    // evaluation: resourceSelectors.resourceEvaluation(state),
    // resourceEvaluations: selectors.resourceEvaluations(state),
    // stepsProgression: selectors.stepsProgression(state)
  })
)(PathOverviewComponent)

export {
  PathOverview
}
