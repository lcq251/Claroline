import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {selectors as resourceSelectors} from '#/main/core/resource/store'
import {PathSummary as PathSummaryComponent} from '#/main/evaluation/sequence/components/summary'
import {selectors} from '#/main/evaluation/sequence/store'

const PathSummary = /*withRouter(*/
  connect(
    (state) => ({
      //basePath: resourceSelectors.path(state),
      //resourceId: resourceSelectors.id(state),
      //path: selectors.path(state),
      //empty: selectors.empty(state),
      // overview: selectors.showOverview(state),
      //showEndPage: selectors.showEndPage(state),
      //resourceEvaluations: selectors.resourceEvaluations(state),
      //stepsProgression: selectors.stepsProgression(state)
    })
  )(PathSummaryComponent)
/*)*/

export {
  PathSummary
}
