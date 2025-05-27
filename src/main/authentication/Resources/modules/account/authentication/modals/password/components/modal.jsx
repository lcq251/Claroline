import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'

import {User as UserTypes} from '#/main/community/prop-types'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

const PasswordModal = props => {
  return (
    <FormModal
      {...omit(props, 'user')}
      name="changePasswordForm"
      title={trans('new_password', {}, 'security')}
      target={['apiv2_user_update', {id: props.user.id}]}
      isNew={false}
      data={props.user}
      saveLabel={trans('change_password', {}, 'actions')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'plainPassword',
              type: 'password',
              label: trans('password'),
              required: true
            }
          ]
        }
      ]}
    />
  )
}

PasswordModal.propTypes = {
  user: T.shape(
    UserTypes.propTypes
  ).isRequired,
  fadeModal: T.func.isRequired
}

export {
  PasswordModal
}
