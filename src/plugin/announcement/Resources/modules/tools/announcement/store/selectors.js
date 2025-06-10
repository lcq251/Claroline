import {createSelector} from 'reselect'
import get from 'lodash/get'

const STORE_NAME = 'announcement'

const tool = (state) => state[STORE_NAME]

const parameters = createSelector(
  [tool],
  (tool) => tool.parameters
)

const posts = createSelector(
  [tool],
  (tool) => tool.posts
)

const sortedPosts = createSelector(
  [posts],
  (posts) => posts.slice().sort((a, b) => {
    if (null === a.meta.publishedAt || a.meta.publishedAt < b.meta.publishedAt) {
      return 1
    } else if (null === b.meta.publishedAt || a.meta.publishedAt > b.meta.publishedAt) {
      return -1
    }

    return 0
  })
)

const listFullContent = createSelector(
  [parameters],
  (parameters) => get(parameters, 'listFullContent', false)
)

const announcementDetail = createSelector(
  [tool],
  (tool) => tool.announcementDetail
)

const detail = createSelector(
  [posts, announcementDetail],
  (posts, announcementDetail) => posts.find(post => post.id === announcementDetail)
)

export const selectors = {
  STORE_NAME,
  posts,
  sortedPosts,
  parameters,
  detail,
  listFullContent
}
