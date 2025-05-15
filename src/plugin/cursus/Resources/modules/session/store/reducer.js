import {makeFetchReducer} from '#/main/app/api/fetch/store'
import {makeListReducer} from '#/main/app/content/list'

import {constants} from '#/plugin/cursus/constants'
import {selectors} from '#/plugin/cursus/session/store/selectors'
import {makeReducer} from '#/main/app/store/reducer'
import {makeInstanceAction} from '#/main/app/store/actions'
import {API_FETCH_INVALIDATE} from '#/main/app/api/fetch/store/actions'

const reducer = makeFetchReducer(selectors.STORE_NAME, {}, {
  users: makeListReducer(selectors.STORE_NAME+'.users', {
    sortBy: {property: 'date', direction: -1},
    filters: {filters: [{property: 'type', value: constants.LEARNER_TYPE, locked: true, hidden: true}]}
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(API_FETCH_INVALIDATE, selectors.STORE_NAME)]: () => true
    })
  }),
  events: makeListReducer(selectors.STORE_NAME+'.events', {
    sortBy: {property: 'startDate', direction: -1},
    filters: {filters: [{property: 'status', value: 'not_ended'}]}
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(API_FETCH_INVALIDATE, selectors.STORE_NAME)]: () => true
    })
  })
})

export {
  reducer
}
