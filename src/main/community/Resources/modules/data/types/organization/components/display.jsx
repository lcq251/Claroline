import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Organization as OrganizationTypes} from '#/main/community/prop-types'

const OrganizationDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_organization', {}, 'community')}
  />

OrganizationDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(
      OrganizationTypes.propTypes
    ),
    T.arrayOf(T.shape(
      OrganizationTypes.propTypes
    ))
  ])
}

export {
  OrganizationDisplay
}
