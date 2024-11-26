import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'

import {MODAL_WORKSPACES} from '#/main/core/modals/workspaces'

const WorkspaceFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-fw fa-book"
    pickerType={MODAL_WORKSPACES}
  />

export {
  WorkspaceFilter
}
