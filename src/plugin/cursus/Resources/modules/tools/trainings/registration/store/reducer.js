import {combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/cursus/tools/trainings/store/selectors'
import {constants} from '#/plugin/cursus/constants'


export const reducer = combineReducers({
  sessions: makeListReducer(selectors.STORE_NAME+'.registration.sessions', {
    sortBy: {property: 'startDate', direction: -1},
    filters: {filters: [{property: 'type', value: constants.LEARNER_TYPE, locked: true, hidden: true}]}
    //filters: {filters: [{property: 'status', value: 'not_ended'}]}
  }),
  events: makeListReducer(selectors.STORE_NAME+'.registration.events', {
    sortBy: {property: 'startDate', direction: -1},
    filters: {filters: [{property: 'type', value: constants.LEARNER_TYPE, locked: true, hidden: true}]}
    //filters: {filters: [{property: 'status', value: 'not_ended'}]}
  })
})
