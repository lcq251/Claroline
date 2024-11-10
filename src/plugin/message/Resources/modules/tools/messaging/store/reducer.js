import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {TOOL_OPEN} from '#/main/core/tool/store/actions'

import {selectors} from '#/plugin/message/tools/messaging/store/selectors'
import {MESSAGE_LOAD} from '#/plugin/message/tools/messaging/store/actions'

const reducer = combineReducers({
  receivedMessages: makeListReducer(`${selectors.STORE_NAME}.receivedMessages`, {
    sortBy: {property: 'date', direction: -1}
  }, {
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true
    })
  }),
  sentMessages: makeListReducer(`${selectors.STORE_NAME}.sentMessages`, {
    sortBy: {property: 'date', direction: -1}
  }, {
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true
    })
  }),
  deletedMessages: makeListReducer(`${selectors.STORE_NAME}.deletedMessages`, {
    sortBy: {property: 'date', direction: -1}
  }, {
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true
    })
  }),

  currentMessage: makeReducer(null, {
    [MESSAGE_LOAD]: (state, action) => action.message
  })
})

export {
  reducer
}
