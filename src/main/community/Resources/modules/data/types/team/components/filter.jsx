import React from 'react'

import {MODAL_TEAMS} from '#/main/community/modals/teams'
import {EntityFilter} from '#/main/app/data/types/entity'

const TeamFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-user-group"
    pickerType={MODAL_TEAMS}
  />

TeamFilter.propTypes = EntityFilter.propTypes

export {
  TeamFilter
}
