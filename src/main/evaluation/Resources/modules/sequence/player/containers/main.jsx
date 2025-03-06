import {connect} from 'react-redux'

import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {SequencePlayer as SequencePlayerComponent} from '#/main/evaluation/sequence/player/components/main'
import {actions, selectors} from '#/main/evaluation/sequence/store'
import {flattenSteps} from '#/main/evaluation/sequence/utils'

const SequencePlayer = connect(
  state => ({
    path: toolSelectors.path(state),
    currentUser: securitySelectors.currentUser(state),
    sequence: selectors.sequence(state),
    navigationEnabled: selectors.navigationEnabled(state),
    steps: flattenSteps(selectors.steps(state)),
    evaluation: selectors.evaluation(state),
    progression: selectors.progression(state)
  }),
  dispatch => ({
    updateProgression(stepId) {
      dispatch(actions.updateProgression(stepId))
    },
    enableNavigation() {
      dispatch(actions.enableNavigation())
    },
    disableNavigation() {
      dispatch(actions.disableNavigation())
    }
  })
)(SequencePlayerComponent)

export {
  SequencePlayer
}
