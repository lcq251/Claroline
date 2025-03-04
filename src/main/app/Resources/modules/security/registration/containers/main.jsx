import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {withReducer} from '#/main/app/store/components/withReducer'
import {actions as formActions, selectors as formSelectors} from '#/main/app/content/form/store'

import {RegistrationMain as RegistrationMainComponent} from '#/main/app/security/registration/components/main'
import {actions, reducer, selectors} from '#/main/app/security/registration/store'
import {actions as securityActions} from '#/main/app/security/store'

const RegistrationMain = withRouter(
  withReducer(selectors.STORE_NAME, reducer)(
    connect(
      (state) => ({
        user: formSelectors.data(formSelectors.form(state, selectors.FORM_NAME)),
        termOfService: selectors.termOfService(state),
        options: selectors.options(state)
      }),
      (dispatch) => ({
        register(user, onRegister) {
          dispatch(formActions.saveForm(selectors.FORM_NAME, ['apiv2_user_register'])).then((response) => {
            if (response) {
              dispatch(securityActions.onLogin(response))
            }

            onRegister(response)
          })
        },
        fetchRegistrationData() {
          dispatch(actions.fetchRegistrationData())
        }
      })
    )(RegistrationMainComponent)
  )
)

export {
  RegistrationMain
}
