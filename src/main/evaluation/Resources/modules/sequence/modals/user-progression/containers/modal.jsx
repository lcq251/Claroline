import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {UserProgressionModal as UserProgressionModalComponent} from '#/main/evaluation/sequence/modals/user-progression/components/modal'
import {actions, reducer, selectors} from '#/main/evaluation/sequence/modals/user-progression/store'

const UserProgressionModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      stepsProgression: selectors.stepsProgression(state),
      lastAttempt: selectors.lastAttempt(state),
      resourceEvaluations: selectors.resourceEvaluations(state)
    }),
    (dispatch) => ({
      fetchUserStepsProgression(resourceId, userId) {
        dispatch(actions.fetchUserStepsProgression(resourceId, userId))
      },
      resetUserStepsProgression() {
        dispatch(actions.resetUserStepsProgression())
      }
    })
  )(UserProgressionModalComponent)
)

export {
  UserProgressionModal
}
