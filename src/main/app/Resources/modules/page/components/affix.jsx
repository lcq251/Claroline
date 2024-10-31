import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const PageAffix = props =>
  <div
    className={classes('mx-auto d-flex flex-row align-items-start', props.className)}
    role="presentation"
  >
    <div className="flex-fill" role="presentation">
      {props.children}
    </div>
    <div className="m-4" style={{width: '24rem'}} role="presentation">
      {props.affix}
    </div>
  </div>

PageAffix.propTypes = {
  className: T.string,
  affix: T.node,
  children: T.node
}

export {
  PageAffix
}
