import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'

import {PageContent} from '#/main/app/page'

import {selectors as resourceSelectors} from '#/main/core/resource'
import {selectors} from '#/plugin/lesson/resources/lesson/store'
import {Chapter} from '#/plugin/lesson/resources/lesson/player/components/chapter'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

/**
 * A simple player used when there is only one page in the lesson.
 */
const PlayerModeSimple = (props) => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const canAdd = hasPermission('edit', resourceNode)
  const embedded = useSelector(resourceSelectors.embedded)

  const pages = useSelector(selectors.pages)
  const page = pages[0]
  const tree = useSelector(selectors.tree)
  const numbering = useSelector(selectors.numbering)

  return (
    <PageContent className={classes('d-flex flex-column', {
      'mx-n4': embedded
    })} poster={resourceNode.poster || page.poster}>
      {!embedded && canAdd &&
        <Button
          className="position-absolute top-0 start-0 z-2 m-3 p-2 btn btn-text-body border-0 bg-body focus-ring lh-1 rounded-2 fs-sm text-uppercase"
          type={LINK_BUTTON}
          icon="fa fa-fw fa-plus fs-base"
          label={trans('new_page', {}, 'lesson')}
          target={`${props.path}/new`}
        />
      }

      <Chapter
        key={page.id}
        path={props.path}
        title={false}
        numbering={getNumbering(numbering, tree.children, page)}
        chapter={page}
      />
    </PageContent>
  )
}

PlayerModeSimple.propTypes = {
  path: T.string
}

export {
  PlayerModeSimple
}
