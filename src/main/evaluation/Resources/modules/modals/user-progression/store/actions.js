import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const USER_PROGRESSION_LOAD  = 'USER_PROGRESSION_LOAD'
export const USER_PROGRESSION_RESET = 'USER_PROGRESSION_RESET'

export const actions = {}

actions.loadUserProgression = makeActionCreator(USER_PROGRESSION_LOAD, 'evaluation', 'progression')
actions.resetUserProgression = makeActionCreator(USER_PROGRESSION_RESET)

actions.fetchUserProgression = (url) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: url,
    success: (data) => dispatch(actions.loadUserProgression(data.evaluation, data.progression))
  }
})
