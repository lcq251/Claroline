import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const TASK_LOAD = 'TASK_LOAD'
export const TASK_SET_LOADED = 'TASK_SET_LOADED'

export const actions = {}

actions.load = makeActionCreator(TASK_LOAD, 'task')
actions.setLoaded = makeActionCreator(TASK_SET_LOADED, 'loaded')

actions.open = (eventId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_task_get', {id: eventId}],
    request: {
      method: 'GET'
    },
    before: () => dispatch(actions.setLoaded(false)),
    success: (response) => {
      dispatch(actions.load(response))
      dispatch(actions.setLoaded(true))
    }
  }
})

actions.markDone = (eventId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_task_mark_done'],
    request: {
      method: 'PUT',
      body: JSON.stringify([eventId])
    },
    success: (response) => dispatch(actions.load(response[0]))
  }
})

actions.markTodo = (eventId) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['apiv2_task_mark_todo'],
    request: {
      method: 'PUT',
      body: JSON.stringify([eventId])
    },
    success: (response) => dispatch(actions.load(response[0]))
  }
})
