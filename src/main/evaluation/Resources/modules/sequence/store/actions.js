import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const SEQUENCE_RELOAD = 'SEQUENCE_RELOAD'
export const SEQUENCE_EVALUATION_UPDATE    = 'SEQUENCE_EVALUATION_UPDATE'
export const STEP_ENABLE_NAVIGATION = 'STEP_ENABLE_NAVIGATION'
export const STEP_DISABLE_NAVIGATION = 'STEP_DISABLE_NAVIGATION'

export const actions = {}

actions.updateUserEvaluation = makeActionCreator(SEQUENCE_EVALUATION_UPDATE, 'userEvaluation', 'progression')
actions.enableNavigation = makeActionCreator(STEP_ENABLE_NAVIGATION)
actions.disableNavigation = makeActionCreator(STEP_DISABLE_NAVIGATION)

actions.reload = makeActionCreator(SEQUENCE_RELOAD, 'sequence')

actions.updateProgression = (stepId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    silent: true,
    url: ['apiv2_sequence_evaluation_update', {id: stepId}],
    request: {
      method: 'PUT'
    },
    success: (response) => dispatch(actions.updateUserEvaluation(response.userEvaluation, response.progression))
  }
})
