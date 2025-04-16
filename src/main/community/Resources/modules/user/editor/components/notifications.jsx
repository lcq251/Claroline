import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {selectors} from '#/main/community/user/editor/store/selectors'

const UserEditorNotifications = () => {
  const currentUser = useSelector(selectors.user)

  return (
    <EditorPage
      title={trans('Notifications')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'email',
              type: 'email',
              label: trans('email'),
              required: true,
              options: {
                unique: {
                  check: ['apiv2_user_get', {field: 'email'}]
                }
              }
            }, {
              name: 'meta.mailNotified',
              type: 'boolean',
              label: trans('get_mail_notifications', {address: currentUser.email})
            }
          ]
        }
      ]}
    />
  )
}

export {
  UserEditorNotifications
}
