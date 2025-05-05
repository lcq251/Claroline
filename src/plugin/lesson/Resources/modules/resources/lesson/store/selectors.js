import {createSelector} from 'reselect'
import get from 'lodash/get'

import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
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

const chapters = createSelector(
  [store],
  (store) => store.chapters
)

const chapter = createSelector(
  [store],
  (store) => store.chapter
)

const tree = createSelector(
  [chapters],
  (chapters) => {
    function buildTree(source, currentChildren, currentSlug) {
      const elements = source.filter(elem => elem.parentSlug === currentSlug)
      elements.forEach(elem => {
        // build a tree node for this element
        const treeNode = {
          id: elem.id,
          level: elem.level,
          slug: elem.slug,
          title: elem.title,
          children: []
        }
        // add it to the parent children array
        currentChildren.push(treeNode)
        // continue recursively, it will stop when no element with the specified parentUUID can be found
        buildTree(source, treeNode.children, elem.slug)
      })
    }

    const result = []
    buildTree(chapters, result, null)

    return result[0]
  }
)

const root = createSelector(
  [chapters],
  (chapters) => chapters.find(chapter => null === chapter.parentSlug)
)

const pages = createSelector(
  [chapters],
  (chapters) => chapters.filter(chapter => null !== chapter.parentSlug)
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
  [nextPage, numbering, tree],
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
  [previousPage, numbering, showOverview, tree],
  (previousPage, numbering, showOverview, tree) => {
    if (previousPage) {
      const previousNumbering = getNumbering(numbering, tree.children, previousPage)

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
  chapters,
  chapter,
  root,
  tree,
  pages,
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
