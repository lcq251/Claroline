import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'
import {MODAL_ROLES} from '#/main/community/modals/roles'

const RoleFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-id-badge"
    pickerType={MODAL_ROLES}
  />

export {
  RoleFilter
}
