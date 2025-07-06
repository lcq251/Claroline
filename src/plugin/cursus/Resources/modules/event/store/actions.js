import isEmpty from 'lodash/isEmpty'

import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {selectors} from '#/plugin/cursus/event/store/selectors'

export const LOAD_EVENT = 'LOAD_EVENT'
export const EVENT_SET_LOADED = 'EVENT_SET_LOADED'

export const actions = {}

actions.setLoaded = makeActionCreator(EVENT_SET_LOADED, 'loaded')
actions.loadEvent = makeActionCreator(LOAD_EVENT, 'event', 'registration')

actions.open = (id, force = false) => (dispatch, getState) => {
  const currentEvent = selectors.event(getState())
  if (force || isEmpty(currentEvent) || currentEvent.id !== id) {
    return dispatch({
      [API_REQUEST]: {
        url: ['apiv2_cursus_event_open', {id: id}],
        silent: true,
        before: () => {
          dispatch(actions.setLoaded(false))
          dispatch(actions.loadEvent(null, null))
        },
        success: (data) => {
          dispatch(actions.loadEvent(data.event, data.registration))
          dispatch(actions.setLoaded(true))
        }
      }
    })
  }
}

actions.register = (id) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_event_self_register', {id: id}],
    request: {
      method: 'PUT'
    },

    success: (response, dispatch) => dispatch(actions.open(id, true))
  }
})

actions.addUsers = (eventId, users, type) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_event_add_users', {id: eventId, type: type}],
    request: {
      method: 'PATCH',
      body: JSON.stringify(users.map(user => user.id))
    },
    success: (data, dispatch) => dispatch(actions.open(eventId, true))
  }
})
