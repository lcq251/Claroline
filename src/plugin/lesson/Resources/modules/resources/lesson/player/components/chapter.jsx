import React, {useCallback} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ContentLoader} from '#/main/app/content/components/loader'
import {PageHeading, PageSection} from '#/main/app/page'
import {Content} from '#/main/app/components/content'
import {Html} from '#/main/app/components/html'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {selectors as resourceSelectors} from '#/main/core/resource/store'
import {Chapter as ChapterTypes} from '#/plugin/lesson/resources/lesson/prop-types'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {actions, selectors} from '#/plugin/lesson/resources/lesson/store'
import {MODAL_PAGE_HISTORY} from '#/plugin/lesson/resources/lesson/modals/history'
import {LessonPlayerNav} from '#/plugin/lesson/resources/lesson/player/components/nav'
import {hasPermission} from '#/main/app/security'
import {ContentPublication} from '#/main/app/content/components/publication'

const Chapter = props => {
  const history = useHistory()
  const dispatch = useDispatch()

  if (isEmpty(props.chapter)) {
    return (
      <ContentLoader
        size="lg"
        description={trans('chapter_loading', {}, 'lesson')}
      />
    )
  }

  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const canEdit = hasPermission('edit', resourceNode)
  const downloadable = useSelector(resourceSelectors.downloadable)

  const lesson = useSelector(selectors.lesson)
  const showNavigation = useSelector(selectors.showNavigation)
  const numbering = useSelector(selectors.numbering)
  const chapterNumbering = getNumbering(numbering, props.treeData.children, props.chapter)

  const downloadChapter = useCallback(() => {
    dispatch(actions.downloadChapterPdf(lesson.id, props.chapter.id))
  }, [lesson.id, props.chapter.slug])

  const deleteChapter = useCallback(() => {
    dispatch(actions.deleteChapter(lesson.id, props.chapter.slug)).then(() => {
      history.push(props.path+'/'+(props.chapter.previousSlug ? props.chapter.previousSlug : ''))
    })
  }, [lesson.id, props.chapter.slug])

  return (
    <>
      <PageHeading
        size="md"
        poster={props.chapter.poster}
        title={chapterNumbering ?
          chapterNumbering + ' ' + props.chapter.title :
          props.chapter.title
        }
        primaryAction="edit"
        actions={[
          {
            name: 'download',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-download',
            label: trans('download', {}, 'actions'),
            displayed: downloadable,
            callback: downloadChapter,
          }, {
            name: 'add-subpage',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-plus',
            label: trans('add_subpage', {}, 'actions'),
            target: `${props.path}/new/${props.chapter.slug}`,
            group: trans('management'),
            displayed: canEdit
          }, {
            name: 'edit',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            target: `${props.path}/${props.chapter.slug}/edit`,
            group: trans('management'),
            exact: true,
            displayed: canEdit
          }, {
            name: 'move',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-arrows',
            label: trans('move', {}, 'actions'),
            callback: () => true,
            group: trans('management'),
            displayed: canEdit
          }, {
            name: 'show-history',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-history',
            label: trans('show_history', {}, 'actions'),
            modal: [MODAL_PAGE_HISTORY, {
              pageId: props.chapter.id
            }]
          }, {
            name: 'delete',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-trash',
            label: trans('delete', {}, 'actions'),
            callback: deleteChapter,
            dangerous: true,
            group: trans('management'),
            confirm: {
              message: trans('page_delete_message', {}, 'lesson'),
              additional: trans('irreversible_action_confirm')
            },
            displayed: canEdit
          }
        ]}
      />

      <PageSection size="md" className="pb-5">
        <Content
          placeholder={trans('no_content')}
          meta={
            <ContentPublication
              user={get(props.chapter, 'meta.creator', {})}
              publishedAt={get(props.chapter, 'meta.createdAt')}
            />
          }
        >
          {props.chapter.text}
        </Content>
      </PageSection>

      {props.internalNotes && props.chapter.internalNote &&
        <PageSection
          size="md"
          className="pb-5"
        >
          <div className="bg-body-tertiary rounded-3 p-4" role="presentation">
            <h2 className="h5">{trans('internal_note')}</h2>
            <Html className="content-text">
              {props.chapter.internalNote}
            </Html>
          </div>
        </PageSection>
      }

      {showNavigation &&
        <LessonPlayerNav
          path={props.path}
          treeData={props.treeData}
        />
      }
    </>
  )
}

Chapter.propTypes = {
  path: T.string.isRequired,
  chapter: T.shape(
    ChapterTypes.propTypes
  ),
  treeData: T.object,
  internalNotes: T.bool
}

export {
  Chapter
}
