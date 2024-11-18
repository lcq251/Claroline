import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {ContentSizing} from '#/main/app/content/components/sizing'

const PageSection = (props) =>
  <div className={classes('page-section', props.className)} role="presentation">
    <ContentSizing className={classes('flex-fill d-flex flex-column', {
      'px-4': !props.flush
    })} size={props.size}>
      {props.title &&
        <div className="page-section-title mb-3" role="presentation">
          <h2 className="h6 mb-0">{props.title}</h2>
          {props.description &&
            <p className="text-body-secondary mt-2 mb-0">{props.description}</p>
          }
        </div>
      }

      {props.children}
    </ContentSizing>
  </div>

PageSection.propTypes = {
  flush: T.bool,
  className: T.string,
  size: T.oneOf(['sm', 'md', 'lg', 'full']),

  // title configuration
  //level: T.number,
  //displayLevel: T.number, // pass null to hide the title
  title: T.string,
  description: T.string,

  // actions toolbar
  actions: T.arrayOf(T.shape({
    // action types
  })),
  children: T.node
}

PageSection.defaultProps = {
  flush: false,
  level: 2, // level 1 is taken by the page title
  displayLevel: 2
}

export {
  PageSection
}
