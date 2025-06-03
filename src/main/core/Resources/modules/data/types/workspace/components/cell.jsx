import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {route} from '#/main/core/workspace/routing'

const WorkspaceCell = (props) =>
  <EntityCell
    {...props}
    // link={(item) => route(item)}
  />

WorkspaceCell.propTypes = {
  data: T.oneOfType([
    T.shape(WorkspaceTypes.propTypes),
    T.arrayOf(
      T.shape(WorkspaceTypes.propTypes)
    )
  ])
}

export {
  WorkspaceCell
}
