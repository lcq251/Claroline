import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'
import {param} from '#/main/app/config'

import {selectors} from '#/main/community/user/editor/store'

const UserEditorOverview = () => {
  const currentUser = useSelector(selectors.user)

  return (
    <EditorPage
      title={trans('overview')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'poster',
              type: 'poster',
              label: trans('poster'),
              hideLabel: true
            }, {
              name: 'username',
              type: 'string',
              label: trans('username'),
              required: true,
              displayed: param('community.username'),
              options: {
                unique: {
                  check: ['apiv2_user_get', {field: 'username'}],
                  error: 'This username already exists.'
                }
              }
            }, {
              name: 'meta.description',
              type: 'string',
              label: trans('À propos de moi'),
              options: {
                long: true,
                minRows: 2
              }
            }
          ]
        }, {
          title: trans('Informations personnelles'),
          subtitle: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet tristique diam, sit amet auctor erat.'),
          primary: true,
          fields: [
            {
              name: 'firstName',
              type: 'string',
              label: trans('first_name'),
              required: true
            }, {
              name: 'lastName',
              type: 'string',
              label: trans('last_name'),
              required: true
            }, {
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
            }, {
              name: 'phone',
              type: 'phone',
              label: trans('phone')
            }
          ]
        }
      ]}
    />
  )
}

export {
  UserEditorOverview
}
