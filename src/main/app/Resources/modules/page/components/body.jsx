import React, {useId, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Poster} from '#/main/app/components/poster'
import {Collapse} from 'react-bootstrap'
import {constants, useSize} from '#/main/app/dom/size'

const PageAside = ({
  children,
  closable = true,
  show = true
}) => {
  const asideId = useId()
  const size = useSize()

  const [opened, setOpened] = useState(show && ![constants.SIZE_XS, constants.SIZE_SM, constants.SIZE_MD].includes(size))

  return (
    <div className="app-page-aside" role="presentation">
      {closable &&
        <Button
          className="position-absolute top-0 start-100 z-2 mt-4 p-3 bg-body-tertiary rounded-end-3 focus-ring"
          type={CALLBACK_BUTTON}
          icon="fa fa-fw fa-list"
          label={trans(opened ? 'hide-menu':'show-menu', {}, 'actions')}
          tooltip={opened ? 'left' : 'right'}
          callback={() => setOpened(!opened)}
          aria-expanded={opened}
          aria-controls={asideId}
        />
      }

      <Collapse in={opened} dimension="width">
        <div id={asideId} className="app-page-aside-content h-100 bg-body-tertiary p-4 scroller-y scroller-thin" role="presentation">
          {children}
        </div>
      </Collapse>
    </div>
  )
}

PageAside.propTypes = {
  children: T.any,
  closable: T.bool,
  show: T.bool
}

const PageBody = ({
  children,
  embedded = false
}) =>
  <div className="app-page-body position-relative" role={!embedded ? 'main' : 'article'} tabIndex={-1}>
    {children}
  </div>

PageBody.propTypes = {
  children: T.any
}

const PageContent = ({
  className,
  poster,
  children
}) =>
  <div className={classes('app-page-content', className)} role="presentation">
    {poster &&
      <Poster url={poster} className="app-page-poster" />
    }

    {children}
  </div>

PageContent.propTypes = {
  className: T.string,
  poster: T.string,
  children: T.any
}

export {
  PageAside,
  PageBody,
  PageContent
}
