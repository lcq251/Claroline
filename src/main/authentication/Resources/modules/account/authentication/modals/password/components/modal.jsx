import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {Button} from '#/main/app/action/components/button'
import {ASYNC_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'
import {DataInput} from '#/main/app/data/components/input'

import {User as UserTypes} from '#/main/community/prop-types'

const PasswordModal = props => {
  const [password, setPassword] = useState(null)

  return (
    <Modal
      {...omit(props, 'user', 'changePassword')}
      title={trans('change_password', {}, 'actions')}
    >
      <form>
        <div className="modal-body" role="presentation">
          <DataInput
            id="userPassword"
            type="password"
            label={trans('password')}
            value={password}
            onChange={setPassword}
            required={true}
          />
        </div>

        <div className="modal-footer" role="presentation">
          <Button
            className="btn btn-text-body"
            type={CALLBACK_BUTTON}
            label={trans('cancel', {}, 'actions')}
          />
          <Button
            className="btn btn-primary"
            htmlType="submit"
            type={ASYNC_BUTTON}
            label={trans('edit', {}, 'actions')}
            disabled={isEmpty(password)}
            request={{
              url: ['apiv2_user_update', {id: props.user.id}],
              request: {
                method: 'PUT',
                body: JSON.stringify(Object.assign({}, props.user, {plainPassword: password}))
              },
              onSuccess: props.fadeModal
            }}
          />
        </div>
      </form>
    </Modal>
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
