import {connect} from 'react-redux'

import {selectors as securitySelectors} from '#/main/app/security/store'

import {SequencePlayer as SequencePlayerComponent} from '#/main/evaluation/sequence/player/components/main'
import {actions, selectors} from '#/main/evaluation/sequence/store'

const SequencePlayer = connect(
  state => ({
    currentUser: securitySelectors.currentUser(state),
    path: selectors.path(state),
    sequence: selectors.sequence(state),
    navigationEnabled: selectors.navigationEnabled(state),
    steps: selectors.orderedSteps(state),
    evaluation: selectors.evaluation(state),
    progression: selectors.progression(state)
  }),
  dispatch => ({
    setCurrentStep(stepId) {
      return dispatch(actions.setCurrentStep(stepId))
    },
    updateProgression(stepId) {
      return dispatch(actions.updateProgression(stepId))
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
