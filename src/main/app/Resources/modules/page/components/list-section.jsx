import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {ButtonSticky} from '#/main/app/button'
import {PageContent} from '#/main/app/page/components/body'

const PageListSection = ({
  className,
  poster,
  children,
  addAction
}) =>
  <PageContent
    className={classes('flex-fill d-flex flex-column', className)}
    poster={poster}
  >
    <h1 className="app-page-heading visually-hidden">Ma liste</h1>

    {children}

    {addAction &&
      <ButtonSticky
        {...addAction}
        className="me-4"
      />
    }
  </PageContent>

PageListSection.propTypes = {
  className: T.string,
  poster: T.string,
  children: T.any,
  addAction: T.shape({
    // Action types
  })
}

export {
  PageListSection
}
