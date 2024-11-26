import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'
import {MODAL_LOCATIONS} from '#/main/core/modals/locations'

const LocationFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-map-marker-alt"
    pickerType={MODAL_LOCATIONS}
  />


export {
  LocationFilter
}
