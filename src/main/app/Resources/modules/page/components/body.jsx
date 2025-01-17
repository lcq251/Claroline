import React, {useId, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Poster} from '#/main/app/components/poster'
import {Collapse} from 'react-bootstrap'

const PageAside = (props) => {
  const asideId = useId()
  const [opened, setOpened] = useState(true)

  return (
    <div className={classes('position-relative', props.className)} role="presentation">
      <Button
        className="position-absolute top-0 start-100 z-1 mt-4 p-3 bg-body-tertiary rounded-end-3 focus-ring"
        type={CALLBACK_BUTTON}
        icon="fa fa-fw fa-list"
        label={trans(opened ? 'hide-menu':'show-menu', {}, 'actions')}
        tooltip="right"
        callback={() => setOpened(!opened)}
        aria-expanded={opened}
        aria-controls={asideId}
      />

      <Collapse in={opened} dimension="width">
        <div id={asideId} className="app-page-aside h-100 bg-body-tertiary p-4 scroller-y scroller-thin" role="presentation">
          {props.children}
        </div>
      </Collapse>
    </div>
  )
}

PageAside.propTypes = {
  className: T.string,
  children: T.any,
  closable: T.bool
}

const PageBody = (props) =>
  <div className="app-page-body" role="presentation">
    {props.children}
  </div>

PageBody.propTypes = {
  children: T.any
}

const PageContent = (props) =>
  <div className={classes('app-page-content', props.className)} role="presentation">
    {props.poster &&
      <Poster url={props.poster} className="app-page-poster" />
    }

    {props.children}
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
