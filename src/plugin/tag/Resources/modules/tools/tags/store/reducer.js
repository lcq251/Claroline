import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store/reducer'

import {TOOL_OPEN} from '#/main/core/tool/store/actions'

import {selectors} from '#/plugin/tag/tools/tags/store/selectors'
import {CONTEXT_OPEN} from '#/main/app/context/store/actions'
import {makeInstanceAction} from '#/main/app/store/actions'
import {API_FETCH_PENDING} from '#/main/app/api/fetch/store/actions'

export const reducer = combineReducers({
  tags: makeListReducer(selectors.STORE_NAME + '.tags', {
    sortBy: {property: 'name', direction: 1}
  }, {
    loaded: makeReducer(false, {
      [CONTEXT_OPEN]: () => false
    }),
    invalidated: makeReducer(false, {
      [TOOL_OPEN]: () => true
    })
  }),
  taggedObjects: makeListReducer(selectors.STORE_NAME + '.taggedObjects', {}, {
    loaded: makeReducer(false, {
      [CONTEXT_OPEN]: () => false,
      [TOOL_OPEN]: () => false,
      [makeInstanceAction(API_FETCH_PENDING, 'tag')]: () => false
    })
  })
})
