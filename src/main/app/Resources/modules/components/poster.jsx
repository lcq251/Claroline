import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {asset} from '#/main/app/config'

const Poster = (props) =>
  <div
    className={classes('poster ratio ratio-poster z-0', props.className)}
    role="presentation"
    style={props.url ? {
      backgroundImage: `url("${asset(props.url)}")`
    } : undefined}
    aria-hidden={true}
  />

Poster.propTypes = {
  className: T.string,
  url: T.string.isRequired
}

export {
  Poster
}
