import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'

import {EditorActions} from '#/main/app/editor'
import {supportEvaluation} from '#/main/core/resource/utils'
import {selectors} from '#/main/core/resource/editor/store'

const ResourceEditorActions = (props) => {
  const editedNode = useSelector(selectors.resourceNode)

  return (
    <EditorActions
      actions={[
        {
          title: trans('Changer le propriétaire'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('Transférer', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          managerOnly: true
        }, {
          title: trans('recompute_evaluations', {}, 'actions'),
          help: trans('recompute_resource_evaluations_help', {}, 'actions'),
          displayed: supportEvaluation(editedNode),
          action: {
            label: trans('recalculate', {}, 'actions'),
            type: ASYNC_BUTTON,
            request: {
              url: ['apiv2_resource_evaluation_recompute', {resourceId: editedNode.id}],
              request: {
                method: 'PUT'
              }
            }
          }
        }, {
          title: trans('purge_evaluations', {}, 'actions'),
          help: trans('purge_resource_evaluations_help', {}, 'actions'),
          action: {
            label: trans('purge', {}, 'actions'),
            type: ASYNC_BUTTON,
            confirm: {
              message: trans('purge_resource_evaluations_confirm', {}, 'actions'),
              additional: trans('irreversible_action_confirm')
            },
            request: {
              url: ['apiv2_resource_evaluation_purge', {resourceId: editedNode.id}],
              request: {
                method: 'DELETE'
              }
            }
          },
          displayed: supportEvaluation(editedNode),
          dangerous: true,
          managerOnly: true
        }, {
          title: trans('Archiver la ressource'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('archive', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          dangerous: true,
          managerOnly: true
        }, {
          title: trans('Supprimer la ressource'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('delete', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          dangerous: true,
          managerOnly: true
        }
      ].concat(props.actions || [])}
    />
  )
}

ResourceEditorActions.propTypes = EditorActions.propTypes
ResourceEditorActions.defaultProps = EditorActions.defaultProps

export {
  ResourceEditorActions
}
