import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {Organization as OrganizationTypes} from '#/main/community/prop-types'
import {MODAL_ORGANIZATIONS} from '#/main/community/modals/organizations'

const OrganizationInput = (props) =>
  <EntityInput
    {...props}
    placeholder={trans('no_organization', {}, 'community')}
    add={trans(props.multiple ? 'add_organizations' : 'add_organization', {}, 'actions')}
    pickerType={MODAL_ORGANIZATIONS}
  />

implementPropTypes(OrganizationInput, EntityInput, {
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
  OrganizationInput
}
