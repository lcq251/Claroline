import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list'
import {
  CHANGE_EVENT,
  CURRENT_EVENT,
  EVENT_SIGNED,
  SIGN_EVENT,
  LOAD_EVENT
} from '#/plugin/cursus/tools/trainings/presence/store/actions'

import {selectors} from '#/plugin/cursus/tools/trainings/presence/store/selectors'

const reducer = combineReducers({
  presences: makeListReducer(selectors.STORE_NAME+'.presences', {
    sortBy: {property: 'startDate', direction: 1},
    filters: {filters: [{property: 'status', value: 'not_ended'}]}
  }),
  currentEvent : makeReducer(null, {
    [CURRENT_EVENT]: (state, action) => action.currentEvent
  }),
  eventLoaded : makeReducer(false, {
    [LOAD_EVENT]: (state, action) => action.eventLoaded
  }),
  code : makeReducer('', {
    [CHANGE_EVENT]: (state, action) => action.code
  }),
  signature : makeReducer('', {
    [SIGN_EVENT]: (state, action) => action.signature
  }),
  eventSigned : makeReducer(null, {
    [EVENT_SIGNED]: (state, action) => action.eventSigned
  })
})


export {
  reducer
}
