import {makeFormReducer} from '#/main/app/content/form/store'
import {makeListReducer} from '#/main/app/content/list/store'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'

import {
  LOAD_COURSE,
  LOAD_COURSE_SESSION,
  LOAD_COURSE_STATS,
  SWITCH_PARTICIPANTS_VIEW
} from '#/plugin/cursus/course/store/actions'
import {constants} from '#/plugin/cursus/constants'
import {selectors} from '#/plugin/cursus/course/store/selectors'

const reducer = combineReducers({
  courseForm: makeFormReducer(selectors.FORM_NAME),
  course: makeReducer(null, {
    [LOAD_COURSE]: (state, action) => action.course
  }),
  courseDefaultSession: makeReducer(null, {
    [LOAD_COURSE]: (state, action) => action.defaultSession || null
  }),
  courseActiveSession: makeReducer(null, {
    [LOAD_COURSE_SESSION]: (state, action) => action.session
  }),
  courseAvailableSessions: makeReducer([], {
    [LOAD_COURSE]: (state, action) => action.availableSessions
  }),
  courseSessionsCanceled: makeListReducer(selectors.STORE_NAME+'.courseSessionsCanceled', {
    sortBy: {property: 'order', direction: 1},
    filters: {filters: [{property: 'status', value: 'not_ended'}]}
  }),
  // current user registrations to course sessions
  courseRegistrations: makeReducer([], {
    [LOAD_COURSE]: (state, action) => action.registrations
  }),

  sessionUsers: makeListReducer(selectors.STORE_NAME+'.sessionUsers', {
    sortBy: {property: 'date', direction: -1},
    filters: {
      filters: [
        {property: 'type', value: constants.LEARNER_TYPE, locked: true, hidden: true},
        // {property: 'pending', value: false, locked: true, hidden: true}
      ]
    }
  }, {
    invalidated: makeReducer(false, {
      [LOAD_COURSE]: () => true,
      [LOAD_COURSE_SESSION]: () => true,
      [SWITCH_PARTICIPANTS_VIEW]: () => true
    })
  }),

  courseStats: makeReducer(null, {
    [LOAD_COURSE_STATS]: (state, action) => action.stats,
    [SWITCH_PARTICIPANTS_VIEW]: () => null
  })
})

export {
  reducer
}
