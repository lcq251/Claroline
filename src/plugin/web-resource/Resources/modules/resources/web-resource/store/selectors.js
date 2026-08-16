import {createSelector} from 'reselect'

const STORE_NAME = 'claroline_web_resource'

const resource = (state) => state[STORE_NAME]

const path = createSelector(
  [resource],
  (resource) => resource.path
)

const aiLessonContext = createSelector(
  [resource],
  (resource) => resource.aiLessonContext
)

export const selectors = {
  STORE_NAME,
  resource,
  path,
  aiLessonContext
}