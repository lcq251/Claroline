import {combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/main/core/resource/dashboard/store/selectors'
const reducer = combineReducers({
  logs: makeListReducer(selectors.STORE_NAME + '.logs', {
    sortBy: { property: 'date', direction: -1 }
  })
})

export {
  reducer
}
