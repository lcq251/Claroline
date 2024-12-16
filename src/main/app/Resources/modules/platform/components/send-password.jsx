/* global window */

import React from 'react'

import {SendPasswordForm} from '#/main/app/security/password/send/containers/send'
import {SecurityPage} from '#/main/app/security/components/page'
import {trans} from '#/main/app/intl'

const PlatformSendPassword = () =>
  <SecurityPage
    title={trans('forgot_password')}
    description={trans('send_password_help')}
  >
    <SendPasswordForm />
  </SecurityPage>

export {
  PlatformSendPassword
}
