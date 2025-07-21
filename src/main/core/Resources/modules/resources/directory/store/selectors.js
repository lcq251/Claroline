import {createSelector} from 'reselect'

import {selectors as resourceSelectors} from '#/main/core/resource/store/selectors'

const STORE_NAME = 'directory'
const LIST_NAME = STORE_NAME

const listConfiguration = createSelector(
  [resourceSelectors.resource],
  (resource) => resource.list || {}
)

export const selectors = {
  STORE_NAME,
  LIST_NAME,

  listConfiguration
}
