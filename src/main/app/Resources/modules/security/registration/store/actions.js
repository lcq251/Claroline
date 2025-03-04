import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

const REGISTRATION_DATA_LOAD = 'REGISTRATION_DATA_LOAD'

const actions = {}

actions.loadRegistrationData = makeActionCreator(REGISTRATION_DATA_LOAD, 'data')

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
