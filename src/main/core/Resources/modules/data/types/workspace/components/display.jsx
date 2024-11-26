import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

const WorkspaceDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_workspace', {}, 'workspace')}
  />

WorkspaceDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(WorkspaceTypes.propTypes),
    T.arrayOf(
      T.shape(WorkspaceTypes.propTypes)
    )
  ])
}

export {
  WorkspaceDisplay
}
