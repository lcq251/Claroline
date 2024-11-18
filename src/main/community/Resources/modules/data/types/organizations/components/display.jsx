import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Organization as OrganizationTypes} from '#/main/community/prop-types'
import {OrganizationCard} from '#/main/community/organization/components/card'

const OrganizationsDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_organization', {}, 'community')}
    card={OrganizationCard}
    multiple={true}
  />

OrganizationsDisplay.propTypes = {
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
  OrganizationsDisplay
}
