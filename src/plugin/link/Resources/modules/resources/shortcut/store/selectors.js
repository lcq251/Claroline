import {createSelector} from 'reselect'

import {selectors as resourceSelectors} from '#/main/core/resource//store/selectors'

const embeddedResource = createSelector(
  [resourceSelectors.resource],
  (shortcut) => shortcut.target
)

export const selectors = {
  embeddedResource
}
