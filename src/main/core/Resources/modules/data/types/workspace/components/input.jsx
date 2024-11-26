import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {trans} from '#/main/app/intl/translation'
import {EntityInput} from '#/main/app/data/types/entity'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'

import {MODAL_WORKSPACES} from '#/main/core/modals/workspaces'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

const WorkspaceInput = (props) => {
  let addLabel
  if (props.model) {
    addLabel = trans(props.multiple ? 'add_workspace_models' : 'add_workspace_model', {}, 'actions')
  } else {
    addLabel = trans(props.multiple ? 'add_workspaces' : 'add_workspace', {}, 'actions')
  }

  return (
    <EntityInput
      {...props}
      add={addLabel}
      pickerType={MODAL_WORKSPACES}
      picker={Object.assign({
        url: props.model ? ['apiv2_workspace_list_model'] : ['apiv2_workspace_list_managed']
      }, props.picker || {})}
    />
  )
}

implementPropTypes(WorkspaceInput, DataInputTypes, {
  value: T.oneOfType([
    T.shape(WorkspaceTypes.propTypes),
    T.arrayOf(
      T.shape(WorkspaceTypes.propTypes)
    )
  ]),
  model: T.bool
}, {
  model: false
})

export {
  WorkspaceInput
}
