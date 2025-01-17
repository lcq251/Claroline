import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/main/evaluation/sequence/dashboard/store/selectors'

const reducer = combineReducers({
  evaluations: makeListReducer(selectors.STORE_NAME+'.evaluations', {
    sortBy: { property: 'date', direction: -1 }
  }, {
    invalidated: makeReducer(false, {

    })
  }),
  logs: makeListReducer(selectors.STORE_NAME + '.logs', {
    sortBy: { property: 'date', direction: -1 }
  })
})

export {
  reducer
}
