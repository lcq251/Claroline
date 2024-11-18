import React from 'react'

import {MODAL_ORGANIZATIONS} from '#/main/community/modals/organizations'
import {EntityFilter} from '#/main/app/data/types/entity'

const OrganizationsFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-building"
    pickerType={MODAL_ORGANIZATIONS}
  />

OrganizationsFilter.propTypes = EntityFilter.propTypes

export {
  OrganizationsFilter
}
