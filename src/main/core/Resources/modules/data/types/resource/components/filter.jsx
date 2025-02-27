import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'
import {MODAL_RESOURCES} from '#/main/core/modals/resources'

const ResourceFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-folder"
    pickerType={MODAL_RESOURCES}
  />

export {
  ResourceFilter
}
