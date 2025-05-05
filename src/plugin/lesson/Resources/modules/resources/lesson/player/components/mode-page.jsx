import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import {useRouteMatch} from 'react-router-dom'
import classes from 'classnames'

import {PageContent} from '#/main/app/page'
import {selectors as resourceSelectors} from '#/main/core/resource'

import {Chapter} from '#/plugin/lesson/resources/lesson/player/components/chapter'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {LessonPlayerNav} from '#/plugin/lesson/resources/lesson/player/components/nav'
import {selectors} from '#/plugin/lesson/resources/lesson/store'

const PlayerModePage = (props) => {
  const match = useRouteMatch()

  const embedded = useSelector(resourceSelectors.embedded)
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const lessonNumbering = useSelector(selectors.numbering)
  const pages = useSelector(selectors.pages)
  const showNavigation = useSelector(selectors.showNavigation)
  const tree = useSelector(selectors.tree)

  const page = pages.find(page => match.params.slug === page.slug)

  return (
    <PageContent className={classes('d-flex flex-column w-100', {
      'mx-n4': embedded
    })} poster={page.poster || resourceNode.poster}>
      <Chapter
        path={props.path}
        chapter={page}
        title={true}
        numbering={getNumbering(lessonNumbering, tree.children, page)}
      />

      {showNavigation &&
        <LessonPlayerNav
          path={props.path}
        />
      }
    </PageContent>
  )
}

PlayerModePage.propTypes = {
  path: T.string.isRequired
}

export {
  PlayerModePage
}
