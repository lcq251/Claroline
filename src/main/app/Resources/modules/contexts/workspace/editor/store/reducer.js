import {combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/main/app/contexts/workspace/editor/store/selectors'

const reducer = combineReducers({
  organizations: makeListReducer(selectors.STORE_NAME + '.organizations', {
    sortBy: {property: 'name', direction: 1}
  })
})

export {
  reducer
}
