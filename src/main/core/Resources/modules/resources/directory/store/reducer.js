import get from 'lodash/get'

import {makeInstanceAction} from '#/main/app/store/actions'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {parseSortBy} from '#/main/app/content/list/utils'
import {constants as listConst} from '#/main/app/content/list/constants'
import {RESOURCE_LOAD} from '#/main/core/resource/store/actions'

import {selectors} from '#/main/core/resources/directory/store/selectors'

const reducer = makeListReducer(selectors.LIST_NAME, {}, {
  invalidated: makeReducer(false, {
    [makeInstanceAction(RESOURCE_LOAD, 'directory')]: () => true
  }),
  selected: makeReducer([], {
    [makeInstanceAction(RESOURCE_LOAD, 'directory')]: () => []
  }),
  filters: makeReducer([], {
    [makeInstanceAction(RESOURCE_LOAD, 'directory')]: (state, action) => get(action.resourceData.resource, 'list.filters') || []
  }),
  pagination: combineReducers({
    page: makeReducer([], {
      [makeInstanceAction(RESOURCE_LOAD, 'directory')]: () => 0
    }),
    pageSize: makeReducer([], {
      [makeInstanceAction(RESOURCE_LOAD, 'directory')]: (state, action) => get(action.resourceData.resource, 'list.pageSize') || listConst.DEFAULT_PAGE_SIZE
    })
  }),
  sortBy: makeReducer([], {
    [makeInstanceAction(RESOURCE_LOAD, 'directory')]: (state, action) => parseSortBy(get(action.resourceData.resource, 'list.sorting', null))
  })
})

export {
  reducer
}
