import {createSelector} from 'reselect'

import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store/selectors'

const STORE_NAME = 'sequenceDashboard'

const path = createSelector(
  [sequenceSelectors.path],
  (sequencePath) => sequencePath + '/dashboard'
)

export const selectors = {
  STORE_NAME,
  path
}
