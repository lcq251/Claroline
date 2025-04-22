import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'
import {MODAL_SEQUENCES} from '#/main/evaluation/modals/sequences'

const SequenceFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-route"
    pickerType={MODAL_SEQUENCES}
  />

export {
  SequenceFilter
}
