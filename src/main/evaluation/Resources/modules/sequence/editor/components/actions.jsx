import React from 'react'

import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'

import {EditorActions} from '#/main/app/editor'
import {useSelector} from 'react-redux'
import {selectors} from '#/main/evaluation/sequence/editor/store'

const SequenceEditorActions = () => {
  const sequence = useSelector(selectors.data)

  return (
    <EditorActions
      actions={[
        {
          title: trans('change_owner', {}, 'actions'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('Transférer', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true,
            disabled: true
          },
          managerOnly: true
        }, {
          title: trans('recompute_evaluations', {}, 'actions'),
          help: trans('recompute_sequence_evaluations_help', {}, 'actions'),
          action: {
            name: 'recompute',
            label: trans('recalculate', {}, 'actions'),
            type: ASYNC_BUTTON,
            request: {
              url: ['apiv2_sequence_evaluation_recompute', {sequenceId: sequence.id}],
              request: {
                method: 'PUT'
              }
            }
          }
        }, {
          title: trans('download_all_certificates', {}, 'actions'),
          help: trans('download_all_sequence_certificates_help', {}, 'actions'),
          action: {
            name: 'download_all_certificates',
            type: ASYNC_BUTTON,
            label: trans('download', {}, 'actions'),
            request: {
              url: ['apiv2_sequence_download_all_certificates', {sequence: sequence.id}],
              request: {
                method: 'GET'
              }
            }
          }
        }, {
          title: trans('purge_evaluations', {}, 'actions'),
          help: trans('purge_sequence_evaluations_help', {}, 'actions'),
          action: {
            name: 'purge',
            label: trans('purge', {}, 'actions'),
            type: ASYNC_BUTTON,
            confirm: {
              message: trans('purge_sequence_evaluations_confirm', {}, 'actions'),
              additional: trans('irreversible_action_confirm')
            },
            request: {
              url: ['apiv2_sequence_evaluation_purge', {sequenceId: sequence.id}],
              request: {
                method: 'DELETE'
              }
            }
          },
          dangerous: true,
          managerOnly: true
        }, {
          title: trans('Supprimer la séquence'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('delete', {}, 'actions'),
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
  SequenceEditorActions
}
