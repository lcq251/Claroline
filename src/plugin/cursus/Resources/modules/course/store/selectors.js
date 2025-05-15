import {createSelector} from 'reselect'

const STORE_NAME = 'course'

const store = (state) => state[STORE_NAME] || {}

const course = createSelector(
  [store],
  (store) => store.course
)

const id = createSelector(
  [course],
  (course) => course ? course.id : null
)

const sessionRegistrations = createSelector(
  [store],
  (store) => store.registrations
)

const availableSessions = createSelector(
  [store],
  (store) => store.availableSessions
)

const defaultSession = createSelector(
  [store],
  (store) => store.defaultSession
)

const activeSession = createSelector(
  [store],
  (store) => store.activeSession
)

const courseStats = createSelector(
  [store],
  (store) => store.stats
)

export const selectors = {
  STORE_NAME,

  id,
  course,
  activeSession,
  defaultSession,
  availableSessions,
  sessionRegistrations,
  courseStats
}
