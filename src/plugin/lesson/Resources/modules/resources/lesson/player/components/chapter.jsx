import React, {useCallback} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ContentLoader} from '#/main/app/content/components/loader'
import {PageContent, PageHeading, PageSection} from '#/main/app/page'
import {Content} from '#/main/app/components/content'
import {Html} from '#/main/app/components/html'
import {UserMicro} from '#/main/core/user/components/micro'
import {Datetime} from '#/main/app/components/date'
import {CALLBACK_BUTTON, LINK_BUTTON, LinkButton, MODAL_BUTTON} from '#/main/app/buttons'

import {Chapter as ChapterTypes} from '#/plugin/lesson/resources/lesson/prop-types'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {actions, selectors} from '#/plugin/lesson/resources/lesson/store'
import {MODAL_PAGE_HISTORY} from '#/plugin/lesson/resources/lesson/modals/history'

const ChapterNavigation = (props) => {
  const showOverview = useSelector(selectors.showOverview)
  const numbering = useSelector(selectors.numbering)

  const next = useSelector(selectors.nextPage)
  const nextNumbering = next ? getNumbering(numbering, props.treeData.children, next) : null

  const previous = useSelector(selectors.previousPage)
  const previousNumbering = previous ? getNumbering(numbering, props.treeData.children, previous) : null

  if (showOverview || previous || next) {
    return (
      <nav className="d-flex flex-row content-md px-2 mt-auto pb-5">
        {(previous || showOverview) &&
          <LinkButton
            className="btn btn-text-body focus-ring w-50 text-start d-flex flex-row align-items-center gap-4 justify-content-start"
            target={`${props.path}/${previous ? previous.slug : ''}`}
            exact={true}
          >
            <span className="fa fa-chevron-left fs-lg" aria-hidden={true} />

            <div className="d-flex flex-column overflow-hidden" role="presentation">
              <b>{trans('previous')}</b>
              {previous ?
                <span className="text-truncate fs-sm" role="presentation">
                  {previousNumbering ?
                    previousNumbering + ' ' + previous.title :
                    previous.title
                  }
                </span> :
                <span className="text-truncate fs-sm" role="presentation">
                  {trans('resource_overview', {}, 'resource')}
                </span>
              }
            </div>
          </LinkButton>
        }

        {next &&
          <LinkButton
            className="btn btn-text-body focus-ring w-50 text-end d-flex flex-row align-items-center gap-4 justify-content-end ms-auto"
            target={`${props.path}/${next.slug}`}
          >
            <div className="d-flex flex-column overflow-hidden" role="presentation">
              <b>{trans('next')}</b>
              <span className="text-truncate fs-sm" role="presentation">
                {nextNumbering ?
                  nextNumbering + ' ' + next.title :
                  next.title
                }
              </span>
            </div>

            <span className="fa fa-chevron-right fs-lg" aria-hidden={true} />
          </LinkButton>
        }
      </nav>
    )
  }

  return null
}

ChapterNavigation.propTypes = {
  path: T.string.isRequired,
  chapter: T.shape(
    ChapterTypes.propTypes
  ),
  treeData: T.object,
  internalNotes: T.bool
}

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
    <PageContent className="d-flex flex-column">
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
            callback: downloadChapter,
          }, {
            name: 'add-subpage',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-plus',
            label: trans('add_subpage', {}, 'actions'),
            target: `${props.path}/new/${props.chapter.slug}`,
            group: trans('management')
          }, {
            name: 'edit',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            target: `${props.path}/${props.chapter.slug}/edit`,
            group: trans('management'),
            exact: true
          }, {
            name: 'move',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-arrows',
            label: trans('move', {}, 'actions'),
            callback: () => true,
            group: trans('management')
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
            }
          }
        ]}
      />

      <PageSection size="md" className="pb-5">
        <Content
          placeholder={trans('no_content')}
          meta={
            <>
              <UserMicro
                {...get(props.chapter, 'meta.creator', {})}
                link={true}
              />

              <span>-</span>

              {get(props.chapter, 'meta.createdAt') &&
                <Datetime value={get(props.chapter, 'meta.createdAt')} long={true} />
              }
            </>
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
        <ChapterNavigation
          path={props.path}
          chapter={props.chapter}
          treeData={props.treeData}
        />
      }
    </PageContent>
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
