import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const USER_PROGRESSION_LOAD = 'USER_PROGRESSION_LOAD'
export const USER_PROGRESSION_RESET = 'USER_PROGRESSION_RESET'

export const actions = {}

actions.loadUserProgression = makeActionCreator(USER_PROGRESSION_LOAD, 'workspaceEvaluation', 'resourceEvaluations')
actions.resetUserProgression = makeActionCreator(USER_PROGRESSION_RESET)

actions.fetchUserProgression = (workspaceId, userId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_workspace_get_user_progression', {workspace: workspaceId, user: userId}],
    silent: true,
    before: () => dispatch(actions.resetUserProgression()),
    success: (response) => dispatch(actions.loadUserProgression(response.workspaceEvaluation, response.resourceEvaluations))
  }
})
