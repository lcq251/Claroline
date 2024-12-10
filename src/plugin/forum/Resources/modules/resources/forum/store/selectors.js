import {createSelector} from 'reselect'

import {hasPermission} from '#/main/app/security'
import {selectors as resourceSelectors} from '#/main/core/resource/store'

const STORE_NAME = 'claroline_forum'

const resource = (state) => state[STORE_NAME]

const forum = createSelector(
  [resource],
  (resource) => resource.forum
)

const forumId = createSelector(
  [forum],
  (forum) => forum.id
)

const moderator = createSelector(
  [resourceSelectors.resourceNode],
  (resourceNode) => hasPermission('edit', resourceNode)
)

const notified = createSelector(
  [resource],
  (resource) => resource.notified
)

const subjects = createSelector(
  [resource],
  (resource) => resource.subjects
)

const messages = createSelector(
  [subjects],
  (subjects) => subjects.messages
)

const totalResults = createSelector(
  [messages],
  (messages) => messages.totalResults
)

const subject = createSelector(
  [subjects],
  (subjects) => subjects.current
)

const visibleMessages = createSelector(
  [messages],
  (messages) => messages.data
)

export const selectors = {
  STORE_NAME,
  resource,
  forum,
  forumId,
  subject,
  messages,
  totalResults,
  moderator,
  notified,
  visibleMessages
}
