import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {ContentSizing} from '#/main/app/content/components/sizing'

const PageSection = ({
  className,
  size,
  title,
  description,
  children,
  flush = false
}) =>
  <div className={classes('page-section', className)} role="presentation">
    <ContentSizing className={classes('flex-fill d-flex flex-column', {
      'px-4': !flush
    })} size={size}>
      {title &&
        <div className="page-section-title mb-3" role="presentation">
          <h2 className="h6 mb-0">{title}</h2>
          {description &&
            <p className="text-body-secondary mt-2 mb-0">{description}</p>
          }
        </div>
      }

      {children}
    </ContentSizing>
  </div>

PageSection.propTypes = {
  className: T.string,
  size: T.oneOf(['sm', 'md', 'lg', 'full']).isRequired,
  title: T.string,
  description: T.string,
  children: T.node,
  flush: T.bool
}

export {
  PageSection
}
