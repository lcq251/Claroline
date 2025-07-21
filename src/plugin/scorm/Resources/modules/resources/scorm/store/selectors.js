import {createSelector} from 'reselect'

import {selectors as resourceSelectors} from '#/main/core/resource/store/selectors'

const STORE_NAME = 'claroline_scorm'

const resource = (state) => state[STORE_NAME]

const scorm = resourceSelectors.resource

const trackings = createSelector(
  [resource],
  (resource) => resource.trackings
)

const scos = createSelector(
  [scorm],
  (scorm) => scorm.scos
)

export const selectors = {
  STORE_NAME,
  scorm,
  scos,
  trackings
}