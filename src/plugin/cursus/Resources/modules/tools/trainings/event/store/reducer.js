import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/cursus/tools/trainings/event/store/selectors'
import {combineReducers} from '#/main/app/store/reducer'
import {constants} from '#/plugin/cursus/constants'

export const reducer = combineReducers({
  list: makeListReducer(selectors.STORE_NAME+'.list', {
    sortBy: {property: 'startDate', direction: -1},
    filters: {filters: [{property: 'status', value: 'not_ended'}]}
  }),
  participants: makeListReducer(selectors.STORE_NAME+'.participants', {
    sortBy: {property: 'date', direction: -1},
    filters: {filters: [{property: 'type', value: constants.LEARNER_TYPE, locked: true, hidden: true}]}
  }),
  tutors: makeListReducer(selectors.STORE_NAME+'.tutors', {
    sortBy: {property: 'date', direction: -1},
    filters: {filters: [{property: 'type', value: constants.TEACHER_TYPE, locked: true, hidden: true}]}
  })
})
