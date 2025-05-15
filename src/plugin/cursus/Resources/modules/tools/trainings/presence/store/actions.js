import {API_REQUEST} from '#/main/app/api'
import {constants} from '#/plugin/cursus/constants'
import {makeActionCreator} from '#/main/app/store/actions'

export const SIGN_EVENT = 'eventSign'
export const CURRENT_EVENT = 'eventCurrent'
export const LOAD_EVENT = 'eventLoad'
export const CHANGE_EVENT = 'eventChange'
export const EVENT_SIGNED = 'eventSigned'

export const actions = {}

actions.setCode = makeActionCreator(CHANGE_EVENT, 'code')
actions.setSignature = makeActionCreator(SIGN_EVENT, 'signature')
actions.setEventLoaded = makeActionCreator(LOAD_EVENT, 'eventLoaded')
actions.setCurrentEvent = makeActionCreator(CURRENT_EVENT, 'currentEvent')
actions.setEventSigned = makeActionCreator(EVENT_SIGNED, 'eventSigned')

actions.getEventByCode = (code = null) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_event_presence_check', {code: code}],
    success: (response, dispatch) => {
      if (typeof response.status !== 'undefined' && constants.PRESENCE_STATUS_PRESENT === response.status) {
        dispatch(actions.setEventSigned(true))
      }
      dispatch(actions.setCurrentEvent(response.event))
      dispatch(actions.setEventLoaded(true))
    },
    error: (response, status, dispatch) => {
      if (status === 404) {
        dispatch(actions.setCurrentEvent(null))
        dispatch(actions.setEventLoaded(true))
      }
    }
  }
})

actions.signPresence = (event, signature) => ({
  [API_REQUEST]: {
    url: ['apiv2_cursus_event_presence_sign'],
    silent: true,
    request: {
      method: 'PUT',
      body: JSON.stringify({
        event: event,
        signature: signature
      })
    },
    success: (response, dispatch) => {
      dispatch(actions.setEventSigned(true))
    }
  }
})
