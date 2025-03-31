import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'

import {Routes} from '#/main/app/router'
import {LINK_BUTTON} from '#/main/app/buttons'
import {PageAside, PageContent} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

import {Chapter} from '#/plugin/lesson/resources/lesson/player/containers/chapter'
import {ChapterForm} from '#/plugin/lesson/resources/lesson/player/components/chapter-form'
import {PlayerSummary} from '#/plugin/lesson/resources/lesson/player/components/summary'
import {actions, selectors} from '#/plugin/lesson/resources/lesson/store'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {LessonPlayerOverview} from '#/plugin/lesson/resources/lesson/player/components/overview'

const LessonPlayer = () => {
  const dispatch = useDispatch()

  const resourcePath = useSelector(resourceSelectors.path)
  const resourceName = useSelector(resourceSelectors.name)
  const embedded = useSelector(resourceSelectors.embedded)

  const lesson = useSelector(selectors.lesson)
  const root = useSelector(selectors.root)
  const tree = useSelector(selectors.treeData)
  const showOverview = useSelector(selectors.showOverview)

  const loadChapter = useCallback((chapterSlug) => {
    dispatch(actions.loadChapter(lesson.id, chapterSlug))
  }, [lesson.id])

  const createChapter = useCallback((parentSlug) => {
    dispatch(actions.createChapter(lesson.id, parentSlug || root.slug))
  }, [lesson.id, root ? root.slug : null])

  const editChapter = useCallback((chapterSlug) => {
    dispatch(actions.editChapter(lesson.id, chapterSlug))
  }, [lesson.id])

  function getPageSummary(page) {
    const numbering = getNumbering(lesson.display.numbering, tree.children, page)

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
      {!embedded &&
        <PageAside closable={true} show={!embedded}>
          <PlayerSummary
            path={resourcePath}
            title={resourceName}
            summary={get(tree, 'children', []).map(getPageSummary)}
            showOverview={showOverview}
          />
        </PageAside>
      }

        <Routes
          path={resourcePath}
          redirect={[
            {from: '/', exact: true, to: '/'+get(tree, 'children[0].slug', null), disabled: showOverview || !get(tree, 'children[0]', null)}
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
              onEnter: (params) => loadChapter(params.slug),
              component: Chapter,
              exact: true
            }, {
              path: '/:slug/edit',
              onEnter: (params) => editChapter(params.slug),
              component: ChapterForm
            }
          ]}
        />
    </ResourcePage>
  )
}

export {
  LessonPlayer
}
