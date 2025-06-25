
import {makeInstanceAction} from '#/main/app/store/actions'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {RESOURCE_LOAD} from '#/main/core/resource/store'

import {FORUM_TOGGLE_NOTIFICATION} from '#/plugin/forum/resources/forum/store/actions'
import {selectors} from '#/plugin/forum/resources/forum/store/selectors'
import {SUBJECT_LOAD} from '#/plugin/forum/resources/forum/store/actions'
import {makeListReducer} from '#/main/app/content/list/store'

const reducer = combineReducers({
  forum: makeReducer({}, {
    [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: (state, action) => action.resourceData.resource
  }),
  notified: makeReducer(false, {
    [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: (state, action) => action.resourceData.notified,
    [FORUM_TOGGLE_NOTIFICATION]: (state, action) => action.notified
  }),
  subjects: combineReducers({
    list: makeListReducer(`${selectors.STORE_NAME}.subjects.list`, {
      sortBy: {property: 'sticked', direction: -1}
    }, {
      invalidated: makeReducer(false, {
        [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: () => true
      })
    }),
    current: makeReducer({}, {
      [SUBJECT_LOAD]: (state, action) => action.subject
    }),
    messages: makeListReducer(`${selectors.STORE_NAME}.subjects.messages`, {
      pagination: {pageSize: -1},
      sortBy: {property: 'creationDate', direction : 1}
    }, {
      invalidated: makeReducer(false, {
        [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: () => true
      })
    })
  }),
  flaggedMessages: makeListReducer(`${selectors.STORE_NAME}.flaggedMessages`, {}, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: () => true
    })
  })
})

export {
  reducer
}
