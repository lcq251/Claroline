import {makeInstanceActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const API_FETCH_PENDING = 'API_FETCH_PENDING'
export const API_FETCH_FULFILLED = 'API_FETCH_FULFILLED'

export const API_FETCH_FAILED = 'API_FETCH_FAILED'

export const actions = {}

/**
 * Loads API response into the store
 */
actions.load = makeInstanceActionCreator(API_FETCH_FULFILLED, 'response')

/**
 * Starts an API call.
 */
actions.request = makeInstanceActionCreator(API_FETCH_PENDING)

actions.fail = makeInstanceActionCreator(API_FETCH_FAILED, 'error', 'errorCode')

/**
 * Calls API.
 */
actions.fetch = (name, url) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: url,
    request: {
      method: 'GET'
    },
    before: () => dispatch(actions.request(name)),
    success: (response) => dispatch(actions.load(name, response)),
    error: (response, errorStatus) => dispatch(actions.fail(name, response, errorStatus))
  }
})
