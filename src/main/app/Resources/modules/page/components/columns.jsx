import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const PageColumnPrimary = (props) =>
  <div className={classes('app-page-column app-page-col-primary', props.className)} role="presentation">
    {props.children}
  </div>

PageColumnPrimary.propTypes = {
  className: T.string,
  children: T.any
}

const PageColumnSecondary = (props) =>
  <div className={classes('app-page-column app-page-col-secondary bg-body-tertiary', props.className)} role="presentation">
    {props.children}
  </div>

PageColumnSecondary.propTypes = {
  className: T.string,
  children: T.any
}

const PageColumns = (props) =>
  <div className={classes('app-page-columns', props.reverse && 'app-page-columns-reverse', props.className)} role="presentation">
    {props.children}
  </div>

PageColumns.propTypes = {
  className: T.string,
  children: T.any,
  reverse: T.bool
}

PageColumns.defaultProps = {
  reverse: false
}

export {
  PageColumns,
  PageColumnPrimary,
  PageColumnSecondary
}
