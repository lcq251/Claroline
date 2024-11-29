import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const PageColumnPrimary = (props) =>
  <div className="app-page-column app-page-col-primary" role="presentation">
    {props.children}
  </div>

PageColumnPrimary.propTypes = {
  children: T.any
}

const PageColumnSecondary = (props) =>
  <div className="app-page-column app-page-col-secondary bg-body-tertiary" role="presentation">
    {props.children}
  </div>

PageColumnSecondary.propTypes = {
  children: T.any
}

const PageColumns = (props) =>
  <div className={classes('app-page-columns', props.reverse && 'app-page-columns-reverse')} role="presentation">
    {props.children}
  </div>

PageColumns.propTypes = {
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
