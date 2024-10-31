import {connect} from 'react-redux'

import {selectors as configSelectors} from '#/main/app/config/store'
import {selectors} from '#/main/community/user/editor'

import {actions} from '#/main/privacy/account/tos/store'
import {TosMain as TosMainComponent} from '#/main/privacy/account/tos/components/main'

const TosMain = connect(
  (state) => ({
    privacy: configSelectors.param(state, 'privacy'),
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
