import React from 'react'
import {useDispatch} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'
import {EditorActions} from '#/main/app/editor'

import {actions} from '#/main/community/user/editor/store'
import {constants as actionConstants} from '#/main/app/action'

const UserEditorActions = () => {
  const dispatch = useDispatch()
  return (
    <EditorActions
      actions={[
        {
          title: trans('Exporter les données'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('export', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => dispatch(actions.export())
          }
        }, {
          title: trans('request_deletion', {}, 'privacy'),
          help: trans('Lorem ipsum dolor sit amet.'),
          dangerous: true,
          action: {
            type: ASYNC_BUTTON,
            label: trans('send', {}, 'actions'),
            request: {
              url: ['apiv2_user_request_account_deletion'],
              request: {method: 'POST', type: actionConstants.ACTION_SEND},
              messages: {
                pending: {
                  title: trans('send.pending.title', {}, 'alerts'),
                  message: trans('send.pending.message', {}, 'alerts')
                },
                success: {
                  title: trans('send.success.title', {}, 'alerts'),
                  message: trans('send.success.message', {}, 'alerts')
                }
              }
            },
            confirm: {
              title: trans('title_dialog_delete_account', {}, 'privacy'),
              message: trans('delete_account_message', {}, 'privacy')
            }
          }
        }, {
          title: trans('Désactiver l\'utilisateur'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('disable', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          dangerous: true,
          managerOnly: true
        }, {
          title: trans('Supprimer l\'utilisateur'),
          help: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          action: {
            label: trans('delete', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => true
          },
          dangerous: true,
          managerOnly: true
        }
      ]}
    />
  )
}

export {
  UserEditorActions
}
