import React from 'react'
import {PropTypes as T} from 'prop-types'

import {PageSection} from '#/main/app/page/components/section'
import {ButtonSticky} from '#/main/app/button'

const PageListSection = (props) =>
  <PageSection
    className="flex-fill d-flex flex-column"
    size="full"
    flush={true}
    {...props}
  >
    {props.children}

    {props.addAction &&
      <ButtonSticky
        {...props.addAction}
        className="me-4"
      />
    }
  </PageSection>

PageListSection.propTypes = {
  addAction: T.shape({
    // Action type
  })
}

export {
  PageListSection
}
