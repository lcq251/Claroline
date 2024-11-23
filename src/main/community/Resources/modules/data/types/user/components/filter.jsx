import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'
import {MODAL_USERS} from '#/main/community/modals/users'

const UserFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-user"
    pickerType={MODAL_USERS}
  />

export {
  UserFilter
}
