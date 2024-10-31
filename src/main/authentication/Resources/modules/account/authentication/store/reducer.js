import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/main/authentication/account/authentication/store/selectors'
import {combineReducers} from '#/main/app/store/reducer'

const reducer = combineReducers({
  tokens: makeListReducer(selectors.STORE_NAME+'.tokens'),
  logs: makeListReducer(selectors.STORE_NAME+'.logs', {
    sortBy: {property: 'date', direction: -1}
  })
})

export {
  reducer
}
