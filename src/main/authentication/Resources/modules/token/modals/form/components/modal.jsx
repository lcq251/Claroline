import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

const STORE_NAME = 'tokenForm'

const TokenFormModal = props => {
  const isNew = !props.token || !props.token.id

  return (
    <FormModal
      {...omit(props, 'token', 'userDisabled')}
      name={STORE_NAME}
      title={trans(isNew ? 'new_token' : 'token', {}, 'security')}
      data={props.token}
      isNew={isNew}
      target={isNew ?
        ['apiv2_apitoken_create'] :
        ['apiv2_apitoken_update', {id: props.token.id}]
      }
      saveLabel={trans('save', {}, 'actions')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'description',
              type: 'string',
              label: trans('description'),
              recommended: true,
              options: {
                long: true
              }
            }, {
              name: 'user',
              type: 'user',
              label: trans('user'),
              required: true,
              disabled: props.userDisabled
            }
          ]
        }
      ]}
    />
  )
}

TokenFormModal.propTypes = {
  token: T.shape({
    id: T.string,
    description: T.string,
    token: T.string
  }),
  userDisabled: T.bool, // for regular users, they only can create tokens for themselves
  onSave: T.func
}

export {
  TokenFormModal
}
