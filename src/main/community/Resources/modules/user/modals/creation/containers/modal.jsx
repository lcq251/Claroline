import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {actions as formActions} from '#/main/app/content/form'

import {UserCreationModal as UserCreationModalComponent} from '#/main/community/user/modals/creation/components/modal'
import {reducer, selectors} from '#/main/community/user/modals/creation/store'

const UserCreationModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      startCreation(defaultData) {
        dispatch(formActions.resetForm(selectors.STORE_NAME, defaultData, true))
      },
      create() {
        return dispatch(formActions.save(selectors.STORE_NAME, ['apiv2_user_create']))
      },
      reset() {
        dispatch(formActions.resetForm(selectors.STORE_NAME, {}, true))
      }
    })
  )(UserCreationModalComponent)
)

export {
  UserCreationModal
}
