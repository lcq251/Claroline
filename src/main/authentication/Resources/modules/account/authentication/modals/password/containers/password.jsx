import {connect} from 'react-redux'

import {actions as userActions} from '#/main/authentication/account/modals/password/store/actions'
import {PasswordModal as PasswordModalComponent} from '#/main/authentication/account/modals/password/components/password'

const PasswordModal = connect(
  null,
  (dispatch) => ({
    changePassword(user, password) {
      dispatch(userActions.updatePassword(user, password))
    }
  })
)(PasswordModalComponent)

export {
  PasswordModal
}
