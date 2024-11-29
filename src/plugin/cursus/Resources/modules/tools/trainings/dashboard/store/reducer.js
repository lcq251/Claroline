import {combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {selectors} from '#/plugin/cursus/tools/trainings/dashboard/store/selectors'

const reducer = combineReducers({
  /**
   * Filled with sessions with remaining places or full
   */
  sessionCapacity: makeListReducer(selectors.STORE_NAME+'.sessionCapacity', {
    pagination: {pageSize: 5}
  }),

  /**
   * Filled with trainings with anomalies which will not run correctly.
   */
  trainingUnavailable: makeListReducer(selectors.STORE_NAME+'.trainingUnavailable', {
    pagination: {pageSize: 5}
  }),

  /**
   * Filled with finished training events with presences to fill / validate
   */
  eventPresences: makeListReducer(selectors.STORE_NAME+'.eventPresences', {
    pagination: {pageSize: 5}
  })
})

export {
  reducer
}
