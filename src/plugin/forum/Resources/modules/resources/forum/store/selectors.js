import {createSelector} from 'reselect'

import {hasPermission} from '#/main/app/security'
import {selectors as resourceSelectors} from '#/main/core/resource/store'

const STORE_NAME = 'claroline_forum'

const resource = (state) => state[STORE_NAME]

const forum = createSelector(
  [resource],
  (resource) => resource.forum
)

const subjects = createSelector(
  [resource],
  (resource) => resource.subjects
)

const messages = createSelector(
  [subjects],
  (subjects) => subjects.messages
)

const currentPage = createSelector(
  [messages],
  (messages) => messages.currentPage
)
const totalResults = createSelector(
  [messages],
  (messages) => messages.totalResults
)
const moderator = createSelector(
  [resourceSelectors.resourceNode],
  (resourceNode) => hasPermission('edit', resourceNode)
)

const notified = createSelector(
  [resource],
  (resource) => resource.notified
)

const subject = createSelector(
  [subjects],
  (subjects) => subjects.current
)

const editingSubject = createSelector(
  [subjects],
  (subjects) => subjects.form.editingSubject
)
const closedSubject = createSelector(
  [subject],
  (subject) => subject.meta.closed
)
const showSubjectForm = createSelector(
  [subjects],
  (subjects) => subjects.form.showSubjectForm
)

const visibleMessages = createSelector(
  [messages],
  (messages) => messages.data
)
export const selectors = {
  STORE_NAME,
  resource,
  forum,
  subject,
  messages,
  totalResults,
  currentPage,
  moderator,
  notified,
  showSubjectForm,
  editingSubject,
  closedSubject,
  visibleMessages,
}
