import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {ButtonSticky} from '#/main/app/button'
import {PageContent} from '#/main/app/page/components/content'

const PageListSection = ({
  className,
  poster,
  title,
  children,
  addAction
}) =>
  <PageContent
    className={classes('flex-fill d-flex flex-column', className)}
    poster={poster}
  >
    <h2 className="app-page-title visually-hidden">{title}</h2>

    {children}

    {addAction && (undefined === addAction.displayed || addAction.displayed) &&
      <ButtonSticky
        {...addAction}
        className="me-4"
      />
    }
  </PageContent>

PageListSection.propTypes = {
  className: T.string,
  poster: T.string,
  title: T.string.isRequired,
  children: T.any,
  addAction: T.shape({
    // Action types
  })
}

export {
  PageListSection as PageContentList,
  // deprecated
  PageListSection
}
