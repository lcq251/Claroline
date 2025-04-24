import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON} from '#/main/app/buttons'

import {selectors as toolSelectors} from '#/main/core/tool'
import {ToolEditorActions} from '#/main/core/tool/editor'

const EvaluationEditorActions = () => {
  const contextType = useSelector(toolSelectors.contextType)
  const contextId = useSelector(toolSelectors.contextId)

  return (
    <ToolEditorActions
      actions={[
        {
          title: trans('initialize_evaluations', {}, 'actions'),
          help: trans('initialize_evaluations_help', {}, 'actions'),
          action: {
            name: 'initialize',
            type: ASYNC_BUTTON,
            label: trans('initialize', {}, 'actions'),
            displayed: 'workspace' === contextType,
            request: {
              url: ['apiv2_workspace_evaluation_init', {workspace: contextId}],
              request: {
                method: 'PUT'
              }
            }
          }
        }, {
          title: trans('recompute_evaluations', {}, 'actions'),
          help: trans('recompute_workspace_evaluations_help', {}, 'actions'),
          action: {
            name: 'recompute',
            type: ASYNC_BUTTON,
            label: trans('recalculate', {}, 'actions'),
            displayed: 'workspace' === contextType,
            request: {
              url: ['apiv2_workspace_evaluation_recompute', {workspaceId: contextId}],
              request: {
                method: 'PUT'
              }
            }
          }
        }, {
          title: trans('download_certificates', {}, 'actions'),
          help: trans('download_workspace_certificates_help', {}, 'actions'),
          action: {
            name: 'download_certificates',
            type: ASYNC_BUTTON,
            label: trans('download', {}, 'actions'),
            request: {
              url: ['apiv2_workspace_download_all_certificates', {workspace: contextId}],
              request: {
                method: 'GET'
              }
            }
          }
        }, {
          title: trans('purge_evaluations', {}, 'actions'),
          help: trans('purge_workspace_evaluations_help', {}, 'actions'),
          action: {
            label: trans('purge', {}, 'actions'),
            type: ASYNC_BUTTON,
            confirm: {
              message: trans('purge_workspace_evaluations_confirm', {}, 'actions'),
              additional: trans('irreversible_action_confirm')
            },
            request: {
              url: ['apiv2_workspace_evaluation_purge', {workspaceId: contextId}],
              request: {
                method: 'DELETE'
              }
            }
          },
          dangerous: true,
          managerOnly: true
        }
      ]}
    />
  )
}

export {
  EvaluationEditorActions
}
