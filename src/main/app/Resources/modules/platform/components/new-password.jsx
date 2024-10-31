import React from 'react'

import {trans} from '#/main/app/intl'
import {SecurityPage} from '#/main/app/security/components/page'

import {ResetPasswordForm} from '#/main/app/security/password/reset/containers/reset'

const PlatformNewPassword = () =>
  <SecurityPage
    title={trans('reset_password')}
  >
    <ResetPasswordForm />
  </SecurityPage>

export {
  PlatformNewPassword
}
