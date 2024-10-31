import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {constants as actionConstants} from '#/main/app/action/constants'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {ActionCard} from '#/main/app/action/components/card'
import {EditorPage} from '#/main/app/editor'

import {Privacy} from '#/main/privacy/components/privacy'

const PrivacyMain = () =>
  <EditorPage
    title={trans('privacy_policy', {}, 'privacy')}
    help={trans('Lorem ipsum dolor sit amet.')}
  >
    <Privacy />

    <ActionCard
      className="mt-4"
      title={trans('request_deletion', {}, 'privacy')}
      help={trans('Lorem ipsum dolor sit amet.')}
      dangerous={true}
      action={{
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
      }}
    />
  </EditorPage>

export {
  PrivacyMain
}
