import cloneDeep from 'lodash/cloneDeep'

import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'
import {actions as listActions} from '#/main/app/content/list/store/actions'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {actions as resourceActions} from '#/main/core/resource/store'
import {selectors} from '#/plugin/lesson/resources/lesson/store/selectors'

export const CHAPTER_LOAD      = 'CHAPTER_LOAD'
export const CHAPTER_RESET     = 'CHAPTER_RESET'
export const CHAPTER_DELETED   = 'CHAPTER_DELETED'
export const TREE_LOADED       = 'TREE_LOADED'
export const POSITION_SELECTED = 'POSITION_SELECTED'

export const actions = {}

actions.chapterLoad      = makeActionCreator(CHAPTER_LOAD, 'chapter')
actions.chapterReset     = makeActionCreator(CHAPTER_RESET)
actions.chapterDeleted   = makeActionCreator(CHAPTER_DELETED, 'tree')
actions.treeLoaded       = makeActionCreator(TREE_LOADED, 'tree')
actions.positionSelected = makeActionCreator(POSITION_SELECTED, 'isRoot')

actions.search = (searchStr, internalNotes = false) => (dispatch) => {
  if (internalNotes) {
    dispatch(listActions.resetFilters(selectors.LIST_NAME, [{property: 'contentAndNote', value: searchStr}]))
  } else {
    dispatch(listActions.resetFilters(selectors.LIST_NAME, [{property: 'content', value: searchStr}]))
  }

  dispatch(listActions.invalidateData(selectors.LIST_NAME))
}

actions.loadChapter = (chapter) => dispatch => {
  dispatch(actions.chapterLoad(chapter))

  if (!chapter.previousSlug) {
    // first chapter
    dispatch(resourceActions.triggerLifecycleAction('play'))
  }

  if (!chapter.nextSlug) {
    // last chapter
    dispatch(resourceActions.triggerLifecycleAction('end'))
  }
}

actions.editChapter = (lessonId, chapterSlug) => dispatch => {
  dispatch(formActions.resetForm(selectors.CHAPTER_EDIT_FORM_NAME, {}, false))

  return dispatch({
    [API_REQUEST]: {
      url: ['apiv2_lesson_chapter_get', {lessonId: lessonId, slug: chapterSlug}],
      success: (response, dispatch) => {
        dispatch(formActions.resetForm(selectors.CHAPTER_EDIT_FORM_NAME, response, false))
        dispatch(actions.chapterLoad(response))
      }
    }
  })
}

actions.createChapter = (lessonId, parentChapterSlug) => dispatch => {
  dispatch(formActions.resetForm(selectors.CHAPTER_EDIT_FORM_NAME, {parentSlug: parentChapterSlug}, true))
}

actions.deleteChapter = (lessonId, chapterSlug) => (dispatch) =>
  dispatch({[API_REQUEST]: {
    url: ['apiv2_lesson_chapter_delete', {lessonId: lessonId, slug: chapterSlug}],
    request: {
      method: 'DELETE'
    },
    success: (response) => {
      dispatch(actions.chapterDeleted(response.tree))
    }
  }})

actions.fetchChapterTree = (lessonId) => (dispatch) => {
  dispatch({[API_REQUEST]: {
    url: ['apiv2_lesson_tree_get', {lessonId}],
    success: (response, dispatch) => dispatch(actions.treeLoaded(response))
  }})
}

actions.positionChange = value => (dispatch, getState) => {
  dispatch(actions.positionSelected(value === selectors.tree(getState()).slug))
}

actions.downloadChapterPdf = (lessonId, chapterId) => ({
  [API_REQUEST]: {
    url: ['icap_lesson_chapter_export_pdf', {lessonId: lessonId, chapter: chapterId}],
    request: {
      method: 'GET'
    }
  }
})
