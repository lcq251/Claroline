import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {PlayerMain as PlayerMainComponent} from '#/main/evaluation/sequence/player/components/main'
import {actions, selectors} from '#/main/evaluation/sequence/store'
import {constants} from '#/main/evaluation/sequence/constants'
import {flattenSteps} from '#/main/evaluation/sequence/utils'

const PlayerMain = withRouter(connect(
  state => ({
    basePath: resourceSelectors.path(state),
    currentUser: securitySelectors.currentUser(state),
    resourceId: resourceSelectors.id(state),
    path: selectors.path(state),
    navigationEnabled: selectors.navigationEnabled(state),
    steps: flattenSteps(selectors.steps(state)),
    workspace: resourceSelectors.workspace(state),
    attempt: selectors.attempt(state),
    stepsProgression: selectors.stepsProgression(state),
    resourceEvaluations: selectors.resourceEvaluations(state)
  }),
  dispatch => ({
    updateProgression(stepId, status = constants.STATUS_SEEN, silent) {
      dispatch(actions.updateProgression(stepId, status, silent))
    },
    enableNavigation() {
      dispatch(actions.enableNavigation())
    },
    disableNavigation() {
      dispatch(actions.disableNavigation())
    }
  })
)(PlayerMainComponent))

export {
  PlayerMain
}
