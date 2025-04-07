import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {UserProgressionModal as UserProgressionModalComponent} from '#/main/evaluation/workspace/modals/user-progression/components/modal'
import {actions, reducer, selectors} from '#/main/evaluation/workspace/modals/user-progression/store'

const UserProgressionModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      resourceEvaluations: selectors.resourceEvaluations(state)
    }),
    (dispatch) => ({
      fetchUserProgression(resourceId, userId) {
        dispatch(actions.fetchUserProgression(resourceId, userId))
      },
      resetUserProgression() {
        dispatch(actions.resetUserProgression())
      }
    })
  )(UserProgressionModalComponent)
)

export {
  UserProgressionModal
}
