import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import {Routes} from '#/main/app/router'
import {LINK_BUTTON} from '#/main/app/buttons'
import {PageAside} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

import {ChapterForm} from '#/plugin/lesson/resources/lesson/player/components/chapter-form'
import {PlayerSummary} from '#/plugin/lesson/resources/lesson/player/components/summary'
import {actions, selectors} from '#/plugin/lesson/resources/lesson/store'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {LessonPlayerOverview} from '#/plugin/lesson/resources/lesson/player/components/overview'
import {PlayerModeSimple} from '#/plugin/lesson/resources/lesson/player/components/mode-simple'
import {PlayerModeInline} from '#/plugin/lesson/resources/lesson/player/components/mode-inline'
import {PlayerModePage} from '#/plugin/lesson/resources/lesson/player/components/mode-page'

const LessonPlayer = () => {
  const dispatch = useDispatch()

  const resourcePath = useSelector(resourceSelectors.path)
  const resourceName = useSelector(resourceSelectors.name)
  const embedded = useSelector(resourceSelectors.embedded)

  const lesson = useSelector(selectors.lesson)
  const root = useSelector(selectors.root)
  const pages = useSelector(selectors.pages)
  const tree = useSelector(selectors.tree)
  const lessonNumbering = useSelector(selectors.numbering)
  const showOverview = useSelector(selectors.showOverview)

  const loadChapter = useCallback((chapter) => {
    dispatch(actions.loadChapter(chapter))
  }, [lesson.id])

  const createChapter = useCallback((parentSlug) => {
    dispatch(actions.createChapter(lesson.id, parentSlug || root.slug))
  }, [lesson.id, root ? root.slug : null])

  const editChapter = useCallback((chapterSlug) => {
    dispatch(actions.editChapter(lesson.id, chapterSlug))
  }, [lesson.id])

  function getPageSummary(page) {
    const numbering = getNumbering(lessonNumbering, tree.children, page)

    return {
      id: page.id,
      type: LINK_BUTTON,
      label: numbering ?
        numbering + ' ' + page.title :
        page.title,
      target: `${resourcePath}/${page.slug}`,
      children: page.children ? page.children.map(getPageSummary) : []
    }
  }

  return (
    <ResourcePage>
      {!embedded && 1 < pages.length &&
        <PageAside closable={true} show={false}>
          <PlayerSummary
            path={resourcePath}
            title={resourceName}
            summary={get(tree, 'children', []).map(getPageSummary)}
            showOverview={showOverview}
          />
        </PageAside>
      }

      {'none' === get(lesson, 'display.pagination', 'all') ?
        <PlayerModeInline
          path={resourcePath}
        /> :
        <Routes
          path={resourcePath}
          redirect={[
            {from: '/', exact: true, to: '/'+get(pages, '[0].slug', null), disabled: showOverview || !get(pages, '[0]', null)}
          ]}
          routes={[
            {
              path: '/',
              component: LessonPlayerOverview,
              disabled: !showOverview,
              exact: true
            }, {
              path: '/new/:parentSlug?',
              exact: true,
              onEnter: (params) => createChapter(params.parentSlug),
              component: ChapterForm
            }, {
              path: '/:slug',
              onEnter: (params) => {
                const page = pages.find(page => params.slug === page.slug)
                if (page) {
                  loadChapter(page)
                }
              },
              exact: true,
              render: () => {
                if (1 === pages.length) {
                  return (
                    <PlayerModeSimple path={resourcePath} />
                  )
                }

                switch (get(lesson, 'display.pagination', 'all') ) {
                  case 'none':
                    return (
                      <PlayerModeInline
                        path={resourcePath}
                      />
                    )
                  case 'page':
                  case 'all':
                  default:
                    return (
                      <PlayerModePage
                        path={resourcePath}
                      />
                    )
                }
              }
            }, {
              path: '/:slug/edit',
              onEnter: (params) => editChapter(params.slug),
              component: ChapterForm
            }
          ]}
        />
      }
    </ResourcePage>
  )
}

export {
  LessonPlayer
}
