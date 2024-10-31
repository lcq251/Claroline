import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {actions as listActions} from '#/main/app/content/list/store'

import {reducer, selectors} from '#/main/authentication/account/authentication/store'
import {AccountAuthentication as AccountAuthenticationComponent}  from '#/main/authentication/account/authentication/components/main'

const AccountAuthentication = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      invalidateList() {
        dispatch(listActions.invalidateData(selectors.STORE_NAME+'.tokens'))
      }
    })
  )(AccountAuthenticationComponent)
)

export {
  AccountAuthentication
}
