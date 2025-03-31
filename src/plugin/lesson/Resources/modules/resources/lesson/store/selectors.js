import {createSelector} from 'reselect'
import get from 'lodash/get'

import {flattenPages, getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {trans} from '#/main/app/intl'

const STORE_NAME = 'icap_lesson'
const LIST_NAME = STORE_NAME + '.chapters'

const CHAPTER_EDIT_FORM_NAME = STORE_NAME + '.chapter_form'

const store = (state) => state[STORE_NAME]

const lesson = createSelector(
  [store],
  (store) => store.resource
)

const placeholders = createSelector(
  [store],
  (store) => store.placeholders
)

const chapter = createSelector(
  [store],
  (store) => store.chapter
)

const tree = createSelector(
  [store],
  (store) => store.tree
)

const treeData = createSelector(
  [tree],
  (tree) => tree.data
)

const root = createSelector(
  [treeData],
  (treeData) => treeData
)

const pages = createSelector(
  [treeData],
  (treeData) => flattenPages(get(treeData, 'children', []))
)

const showOverview = createSelector(
  [lesson],
  (lesson) => get(lesson, 'display.showOverview', false)
)

const showMeta = createSelector(
  [lesson],
  (lesson) => get(lesson, 'display.showMeta', false)
)

const showNavigation = createSelector(
  [lesson],
  (lesson) => get(lesson, 'display.navigation', false)
)

const numbering = createSelector(
  [lesson],
  (lesson) => get(lesson, 'display.numbering', null)
)

const nextPage = createSelector(
  [chapter, pages],
  (current, pages) => {
    if (current.nextSlug) {
      return pages.find(page => page.slug === current.nextSlug)
    }

    return null
  }
)

const nextPath = createSelector(
  [nextPage],
  (nextPage) => nextPage ? '/'+nextPage.slug : null
)

const nextTitle = createSelector(
  [nextPage, numbering, treeData],
  (nextPage, numbering, treeData) => {
    if (nextPage) {
      const nextNumbering = getNumbering(numbering, treeData.children, nextPage)

      return nextNumbering ?
        nextNumbering + ' ' + nextPage.title :
        nextPage.title
    }

    return null
  }
)

const previousPage = createSelector(
  [chapter, pages],
  (current, pages) => {
    if (current.previousSlug) {
      return pages.find(page => page.slug === current.previousSlug)
    }

    return null
  }
)

const previousPath = createSelector(
  [previousPage, showOverview],
  (previousPage, showOverview) => {
    if (previousPage) {
      return '/'+previousPage.slug
    } else if (showOverview) {
      return '/'
    }

    return null
  }
)

const previousTitle = createSelector(
  [previousPage, numbering, showOverview, treeData],
  (previousPage, numbering, showOverview, treeData) => {
    if (previousPage) {
      const previousNumbering = getNumbering(numbering, treeData.children, previousPage)

      return previousNumbering ?
        previousNumbering + ' ' + previousPage.title :
        previousPage.title
    } else if (showOverview) {
      return trans('resource_overview', {}, 'resource')
    }

    return null
  }
)

export const selectors = {
  STORE_NAME,
  LIST_NAME,
  CHAPTER_EDIT_FORM_NAME,

  lesson,
  placeholders,
  chapter,
  root,
  treeData,
  showOverview,
  showMeta,
  showNavigation,
  numbering,
  nextPage,
  nextTitle,
  nextPath,
  previousPage,
  previousTitle,
  previousPath
}
