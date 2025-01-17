import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {ButtonSticky} from '#/main/app/button'
import {PageContent} from '#/main/app/page/components/body'

const PageListSection = (props) =>
  <PageContent
    className={classes('flex-fill d-flex flex-column', props.className)}
  >
    {props.children}

    {props.addAction &&
      <ButtonSticky
        {...props.addAction}
        className="me-4"
      />
    }
  </PageContent>

PageListSection.propTypes = {
  addAction: T.shape({
    // Action types
  })
}

export {
  PageListSection
}
