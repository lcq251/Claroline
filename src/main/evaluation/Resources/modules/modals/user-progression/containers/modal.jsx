import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {UserProgressionModal as UserProgressionModalComponent} from '#/main/evaluation/modals/user-progression/components/modal'
import {actions, reducer, selectors} from '#/main/evaluation/modals/user-progression/store'

const UserProgressionModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      // evaluation: selectors.evaluation(state),
      progression: selectors.progression(state)
    }),
    (dispatch) => ({
      fetchUserProgression(url) {
        dispatch(actions.fetchUserProgression(url))
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
