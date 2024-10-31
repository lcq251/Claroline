import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

import {actions as securityActions} from '#/main/app/security/store/actions'
import {constants} from '#/main/app/security/registration/constants'

const REGISTRATION_DATA_LOAD = 'REGISTRATION_DATA_LOAD'

const actions = {}

actions.loadRegistrationData = makeActionCreator(REGISTRATION_DATA_LOAD, 'data')

actions.createUser = (user, onCreated = () => {}) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_user_register'],
    messages: constants.ALERT_REGISTRATION,
    request: {
      method: 'POST',
      body: JSON.stringify(user)
    },
    success: (response) => {
      if (response) {
        dispatch(securityActions.onLogin(response))
      }

      onCreated(response)
    }
  }
})

actions.fetchRegistrationData = () => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_user_initialize_registration'],
    request: {
      method: 'GET'
    },
    success: (data) => dispatch(actions.loadRegistrationData(data))
  }
})

export {
  actions,
  REGISTRATION_DATA_LOAD
}
