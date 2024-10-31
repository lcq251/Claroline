import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {selectors as editorSelectors} from '#/main/community/user/editor'
import {ContextHistory} from '#/main/app/context/components/history'
import isEmpty from 'lodash/isEmpty'

const AccountHistory = props => {
  const authenticatedUserId = useSelector(securitySelectors.currentUserId)
  const user = useSelector(editorSelectors.user)

  let me = false
  if (user && user.id === authenticatedUserId) {
    me = true
  }

  return (
    <EditorPage
      title={trans('history', {}, 'history')}
      help={trans('history_desc', {}, 'history')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'userPreferences.history',
              type: 'boolean',
              label: trans('enable_history', {}, 'history'),
              help: trans('enable_history_help', {}, 'history'),
              required: true
            }
          ]
        },
      ]}
    >
      <hr className="mb-5 mt-4" aria-hidden="true" />

      {me &&
        <ContextHistory className="mb-5" size="sm" empty={true} />
      }

      {!isEmpty(user) && !me &&
        <div className="text-center" role="presentation">
          <p className="lead mb-1">{trans('history_unavailable', {}, 'history')}</p>
          <p className="mb-0 text-secondary">{trans('history_unavailable_help', {}, 'history')}</p>
        </div>
      }
    </EditorPage>
  )
}

export {
  AccountHistory
}
