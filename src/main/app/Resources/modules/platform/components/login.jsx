import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {SecurityPage} from '#/main/app/security/components/page'

import {LoginMain} from '#/main/app/security/login/containers/main'
import {selectors as configSelectors} from '#/main/app/config/store'

const PlatformLogin = () => {
  const history = useHistory()
  const routeParams = useParams()

  const platformName = useSelector((state) => configSelectors.param(state, 'name'))

  return (
    <SecurityPage
      title={trans('login')}
      description={trans('login_auth_account', {platform: platformName})}
    >
      <LoginMain
        forceInternalAccount={routeParams.forceInternalAccount}
        onLogin={() => {
          history.push('/desktop')
        }}
      />
    </SecurityPage>
  )
}

export {
  PlatformLogin
}
