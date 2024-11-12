import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Organization as OrganizationTypes} from '#/main/community/prop-types'
import {OrganizationCard} from '#/main/community/organization/components/card'


const OrganizationsDisplay = (props) =>
  <EntityDisplay
    icon="fa fa-building"
    placeholder={trans('no_organization', {}, 'community')}
    card={OrganizationCard}
    data={props.data}
    multiple={true}
  />

OrganizationsDisplay.propTypes = {
  data: T.arrayOf(T.shape(
    OrganizationTypes.propTypes
  ))
}

export {
  OrganizationsDisplay
}
