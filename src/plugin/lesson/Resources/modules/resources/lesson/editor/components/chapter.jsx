import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'
import {selectors as editorSelectors} from '#/main/core/resource/editor'

import {selectors} from '#/plugin/lesson/resources/lesson/editor/store'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {LINK_BUTTON} from '#/main/app/buttons'

const LessonEditorChapter = (props) => {
  const resourceEditorPath = useSelector(editorSelectors.path)
  const hasInternalNotes = useSelector(selectors.hasInternalNotes)
  const numbering = useSelector(selectors.numbering)

  const allChapters = useSelector(selectors.chapters)
  let chapterIndex = 0
  let chapter
  if (get(props.match, 'params.slug')) {
    chapterIndex = allChapters.findIndex(c => c.slug === get(props.match, 'params.slug'))
    if (-1 !== chapterIndex) {
      chapter = allChapters[chapterIndex]
    }
  }

  const chapterNumbering = chapter ? getNumbering(numbering, allChapters, chapter) : ''
  let chapterTitle = ''
  if (chapterNumbering) {
    chapterTitle = chapterNumbering + ' '
  }

  if (get(chapter, 'title')) {
    chapterTitle += get(chapter, 'title')
  } else {
    chapterTitle += trans('page', {number: chapterIndex + 1}, 'lesson')
  }

  return (
    <EditorPage
      title={chapterTitle}
      dataPart={`chapters[${chapterIndex}]`}
      actions={[
        {
          name: 'summary',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-list',
          label: trans('open-summary', {}, 'actions'),
          target: resourceEditorPath+'/content',
          exact: true
        }
      ]}
      definition={[
        {
          name: 'general',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'poster',
              label: trans('poster'),
              type: 'poster',
              hideLabel: true
            }, {
              name: 'title',
              label: trans('title'),
              type: 'string',
              required: true,
              autoFocus: true
            }, {
              name: 'text',
              type: 'html',
              label: trans('text'),
              required: true,
              options: {
                //workspace: props.workspace,
                minRows: 10
              }
            }, {
              name: '_enableInternalNote',
              type: 'boolean',
              label: trans('add_internal_note', {}, 'lesson'),
              displayed: hasInternalNotes,
              help: trans('internal_note_visibility_help', {}, 'lesson'),
              calculated: (chapter) => chapter._enableInternalNote || chapter.internalNote,
              linked: [
                {
                  name: 'internalNote',
                  type: 'html',
                  label: trans('text'),
                  required: true,
                  displayed: (chapter) => chapter._enableInternalNote || chapter.internalNote,
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
  )
}

LessonEditorChapter.propTypes = {
  match: T.shape({
    params: T.shape({
      slug: T.string.isRequired
    }).isRequired
  }).isRequired
}

export {
  LessonEditorChapter
}
