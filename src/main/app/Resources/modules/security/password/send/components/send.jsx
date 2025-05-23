import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

import {selectors} from '#/main/app/security/password/send/store/selectors'

const SendPasswordForm = (props) =>
  <>
    <FormData
      name={selectors.FORM_NAME}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'email',
              label: trans('email'),
              type: 'email',
              required: true
            }
          ]
        }
      ]}
    >
      <Button
        className="btn btn-primary w-100"
        size="lg"
        htmlType="submit"
        type={CALLBACK_BUTTON}
        label={trans('send_password')}
        callback={() => props.reset(props.form.data.email, () => {
          props.history.push('/login')
        })}
      />
    </FormData>

    <Button
      className="btn btn-body w-100 mt-1"
      type={LINK_BUTTON}
      label={trans('login', {}, 'actions')}
      target="/login"
    />
  </>

SendPasswordForm.propTypes = {
  reset: T.func.isRequired,
  form: T.object,
  history: T.object
}

export {
  SendPasswordForm
}
