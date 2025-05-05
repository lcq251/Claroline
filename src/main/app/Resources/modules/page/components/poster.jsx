import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Poster} from '#/main/app/components/poster'

const PagePoster = ({poster, className}) =>
  <Poster url={poster} className={classes('app-page-poster', className)} />

PagePoster.propTypes = {
  className: T.string,
  poster: T.string.isRequired
}

export {
  PagePoster
}
