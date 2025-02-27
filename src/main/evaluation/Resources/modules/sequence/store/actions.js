import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

import {constants} from '#/main/evaluation/sequence/constants'

export const SEQUENCE_RELOAD = 'SEQUENCE_RELOAD'
export const SEQUENCE_EVALUATION_UPDATE    = 'SEQUENCE_EVALUATION_UPDATE'
export const STEP_ENABLE_NAVIGATION = 'STEP_ENABLE_NAVIGATION'
export const STEP_DISABLE_NAVIGATION = 'STEP_DISABLE_NAVIGATION'
export const STEP_UPDATE_PROGRESSION = 'STEP_UPDATE_PROGRESSION'

export const actions = {}

actions.updateUserEvaluation = makeActionCreator(SEQUENCE_EVALUATION_UPDATE, 'userEvaluation', 'resourceEvaluations')
actions.enableNavigation = makeActionCreator(STEP_ENABLE_NAVIGATION)
actions.disableNavigation = makeActionCreator(STEP_DISABLE_NAVIGATION)
actions.updateStepProgression = makeActionCreator(STEP_UPDATE_PROGRESSION, 'stepId', 'status')

actions.reload = makeActionCreator(SEQUENCE_RELOAD, 'sequence')

actions.updateProgression = (stepId, silent = true) => ({
  [API_REQUEST]: {
    silent: silent,
    url: ['apiv2_sequence_evaluation_update', {id: stepId}],
    request: {
      method: 'PUT'
    },
    success: (response, dispatch) => {
      dispatch(actions.updateUserEvaluation(response.userEvaluation, response.resourceEvaluations))

      dispatch(actions.updateStepProgression(response.userProgression.stepId, response.userProgression.status))
    }
  }
})
