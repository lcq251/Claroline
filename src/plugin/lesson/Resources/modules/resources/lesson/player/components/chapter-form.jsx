import React from 'react'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import classes from 'classnames'

import {withRouter} from '#/main/app/router'
import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {PageContent} from '#/main/app/page'
import {actions as formActions, selectors as formSelectors} from '#/main/app/content/form/store'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {selectors} from '#/plugin/lesson/resources/lesson/store'

const ChapterFormComponent = props =>
  <PageContent className={classes('d-flex flex-column', {
    'mx-n4': props.embedded
  })}>
    <FormData
      className="my-5 px-4"
      id={`chapter-${props.id}`}
      level={3}
      displayLevel={2}
      name={selectors.CHAPTER_EDIT_FORM_NAME}
      buttons={true}
      save={{
        type: CALLBACK_BUTTON,
        callback: () => props.save(!props.isNew ? ['apiv2_lesson_chapter_update', {
          lessonId: props.lesson.id,
          slug: props.slug
        }] : ['apiv2_lesson_chapter_create', {
          lessonId: props.lesson.id,
          slug: props.parentSlug
        }]).then((response) => props.history.push(props.path + '/' + response.slug))
      }}
      cancel={{
        type: LINK_BUTTON,
        target: props.path,
        exact: true
      }}
      definition={[
        {
          id: 'chapter',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'poster',
              type: 'poster',
              label: trans('poster'),
              hideLabel: true
            }, {
              name: 'title',
              type: 'string',
              required: true,
              label: trans('title')
            }, {
              name: 'text',
              type: 'html',
              label: trans('content'),
              recommended: true,
              options: {
                workspace: props.workspace,
                minRows: 10
              }
            }, {
              name: '_internalNote',
              type: 'boolean',
              label: trans('add_internal_note', {}, 'lesson'),
              help: trans('internal_note_visibility_help', {}, 'lesson'),
              displayed: props.internalNotes,
              calculated: (pageData) => !isEmpty(pageData.internalNote) || pageData._internalNote,
              linked: [
                {
                  name: 'internalNote',
                  type: 'html',
                  label: trans('text'),
                  displayed: (pageData) => props.internalNotes  && (!isEmpty(pageData.internalNote) || pageData._internalNote),
                  options: {
                    workspace: props.workspace,
                    minRows: 10
                  }
                }
              ]
            }
          ]
        }
      ]}
    />
  </PageContent>

const ChapterForm = withRouter(connect(
  state => ({
    path: resourceSelectors.path(state),
    workspace: resourceSelectors.workspace(state),
    embedded: resourceSelectors.embedded(state),
    lesson: selectors.lesson(state),
    chapter: selectors.chapter(state),
    internalNotes: hasPermission('view_internal_notes', resourceSelectors.resourceNode(state)),
    isNew: formSelectors.isNew(formSelectors.form(state, selectors.CHAPTER_EDIT_FORM_NAME)),
    slug: formSelectors.data(formSelectors.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).slug || null,
    parentSlug: formSelectors.data(formSelectors.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).parentSlug || null,
    hasParentSlug: !!formSelectors.data(formSelectors.form(state, selectors.CHAPTER_EDIT_FORM_NAME)).parentSlug,
  }),
  (dispatch) => ({
    save(target) {
      return dispatch(formActions.save(selectors.CHAPTER_EDIT_FORM_NAME, target))
    }
  })
)(ChapterFormComponent))

export {
  ChapterForm
}
