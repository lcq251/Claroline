import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {OrganizationCard} from '#/main/community/organization/components/card'
import {Organization as OrganizationTypes} from '#/main/community/prop-types'
import {MODAL_ORGANIZATIONS} from '#/main/community/modals/organizations'

const OrganizationsInput = props =>
  <EntityInput
    {...props}
    icon="fa fa-building"
    placeholder={trans('no_organization', {}, 'community')}
    card={OrganizationCard}
    multiple={true}
    pickerType={MODAL_ORGANIZATIONS}
  />

implementPropTypes(OrganizationsInput, EntityInput.propTypes, {
  value: T.oneOfType([
    T.shape(
      OrganizationTypes.propTypes
    ),
    T.arrayOf(T.shape(
      OrganizationTypes.propTypes
    ))
  ])
})

export {
  OrganizationsInput
}
