import React from 'react'

import {MODAL_GROUPS} from '#/main/community/modals/groups'
import {EntityFilter} from '#/main/app/data/types/entity'

const GroupFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-users"
    pickerType={MODAL_GROUPS}
  />

export {
  GroupFilter
}
