import {connect} from 'react-redux'

import {selectors} from '#/main/community/user/editor'

import {actions} from '#/main/privacy/account/tos/store'
import {TosMain as TosMainComponent} from '#/main/privacy/account/tos/components/main'

const TosMain = connect(
  (state) => ({
    currentUser: selectors.user(state)
  }),
  (dispatch) => ({
    acceptTerms() {
      dispatch(actions.acceptTerms())
    }
  })
)(TosMainComponent)

export {
  TosMain
}
