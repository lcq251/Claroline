import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const PlaceholderWrapper = props =>
  <div id={props.id} className={classes('empty-placeholder', props.className, props.size && `empty-placeholder-${props.size}`)} style={props.style} role="presentation">
    {props.children}
  </div>

PlaceholderWrapper.propTypes = {
  id: T.string,
  className: T.string,
  size: T.oneOf(['sm', 'md', 'lg']),
  style: T.object,
  children: T.node.isRequired
}

const ContentPlaceholder = props =>
  <PlaceholderWrapper
    id={props.id}
    className={props.className}
    size={props.size || 'md'}
    style={props.style}
  >
    {props.icon &&
      <span className={`placeholder-icon ${props.icon}`} aria-hidden={true} />
    }

    <div className="placeholder-body" role="presentation">
      <span className="placeholder-title" role="presentation">{props.title}</span>

      {props.help &&
        <span className="placeholder-help" role="presentation">{props.help}</span>
      }

      {props.children}
    </div>
  </PlaceholderWrapper>

ContentPlaceholder.propTypes = {
  id: T.string,
  icon: T.string,
  title: T.string.isRequired,
  className: T.string,
  help: T.string,
  size: T.oneOf(['sm', 'md', 'lg']),
  style: T.object,
  children: T.node
}

export {
  ContentPlaceholder
}
