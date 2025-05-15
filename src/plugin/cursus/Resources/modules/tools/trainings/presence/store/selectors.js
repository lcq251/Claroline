import {createSelector} from 'reselect'
import {selectors as trainingSelectors} from '#/plugin/cursus/tools/trainings/store/selectors'

const STORE_NAME = trainingSelectors.STORE_NAME + '.presence'

const store = (state) => state[STORE_NAME]

const currentEvent = createSelector(
  [store],
  (store) => store.currentEvent
)

const eventLoaded = createSelector(
  [store],
  (store) => store.eventLoaded
)

const signature = createSelector(
  [store],
  (store) => store.signature
)

const code = createSelector(
  [store],
  (store) => store.code
)

const eventSigned = createSelector(
  [store],
  (store) => store.eventSigned
)

export const selectors = {
  STORE_NAME,
  currentEvent,
  eventLoaded,
  signature,
  code,
  eventSigned
}
