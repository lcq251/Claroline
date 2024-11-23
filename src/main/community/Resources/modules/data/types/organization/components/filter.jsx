import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'
import {MODAL_ORGANIZATIONS} from '#/main/community/modals/organizations'

const OrganizationFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-building"
    pickerType={MODAL_ORGANIZATIONS}
  />

export {
  OrganizationFilter
}
