import {makeInstanceActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const USER_PROGRESSION_LOAD  = 'USER_PROGRESSION_LOAD'
export const USER_PROGRESSION_RESET = 'USER_PROGRESSION_RESET'

export const actions = {}

actions.loadUserProgression = makeInstanceActionCreator(USER_PROGRESSION_LOAD, 'evaluation', 'progression')
actions.resetUserProgression = makeInstanceActionCreator(USER_PROGRESSION_RESET)

actions.fetchUserProgression = (name, url) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: url,
    before: () => dispatch(actions.resetUserProgression(name)),
    success: (data) => dispatch(actions.loadUserProgression(name, data.evaluation, data.progression))
  }
})
