import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'

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
              url: ['apiv2_workspace_evaluations_init', {workspace: contextId}],
              request: {
                method: 'PUT'
              }
            }
          }
        }, {
          title: trans('recompute_evaluations', {}, 'actions'),
          help: trans('recompute_evaluations_help', {}, 'actions'),
          action: {
            name: 'recompute',
            type: ASYNC_BUTTON,
            label: trans('recalculate', {}, 'actions'),
            displayed: 'workspace' === contextType,
            request: {
              url: ['apiv2_workspace_evaluations_recompute', {workspace: contextId}],
              request: {
                method: 'PUT'
              }
            }
          }
        }, {
          title: trans('download_all_certificates', {}, 'actions'),
          help: trans('download_all_certificates_help', {}, 'actions'),
          action: {
            name: 'download_all_certificates',
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
          title: trans('Purger les évaluations'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('purge', {}, 'actions'),
            type: CALLBACK_BUTTON,
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
  EvaluationEditorActions
}
