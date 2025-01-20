import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Poster} from '#/main/app/components/poster'

const PagePoster = (props) =>
  <Poster url={props.poster} className="app-page-poster z-n1" />

PagePoster.propTypes = {
  poster: T.string.isRequired
}

export {
  PagePoster
}
