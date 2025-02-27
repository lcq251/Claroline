import React from 'react'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {ToolEditorActions} from '#/main/core/tool/editor'

const WorkspacesEditorActions = () => {
  return (
    <ToolEditorActions
      actions={[
        {
          title: trans('purge_archived_workspaces', {}, 'actions'),
          help: trans('purge_archived_workspaces_help', {}, 'actions'),
          action: {
            label: trans('purge', {}, 'actions'),
            type: CALLBACK_BUTTON,
            confirm: {
              message: trans('purge_archived_workspaces_confirm', {}, 'actions'),
              additional: trans('irreversible_action_confirm')
            },
            callback: () => true,
            disabled: true
          },
          dangerous: true,
          managerOnly: true
        }
      ]}
    />
  )
}

export {
  WorkspacesEditorActions
}
