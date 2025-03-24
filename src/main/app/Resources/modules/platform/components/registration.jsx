import React from 'react'
import {useHistory} from 'react-router-dom'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {param} from '#/main/app/config'
import {SecurityPage} from '#/main/app/security/components/page'

import {RegistrationMain} from '#/main/app/security/registration/containers/main'
import {selectors as configSelectors} from '#/main/app/config/store'

const PlatformRegistration = () => {
  const history = useHistory()

  const platformName = useSelector((state) => configSelectors.param(state, 'name'))

  return (
    <SecurityPage
      title={trans('registration')}
      description={trans('registration_help', {platform: platformName})}
    >
      <RegistrationMain
        className="content-sm"
        path="/registration"
        onRegister={(response) => {
          if (get(response, 'user')) {
            if (document.referrer && -1 !== document.referrer.indexOf(param('serverUrl'))) {
              // only redirect to previous url if it's part of the claroline platform
              history.goBack()
            } else {
              history.push('/desktop')
            }
          } else {
            history.push('/login')
          }
        }}
      />
    </SecurityPage>
  )
}

export {
  PlatformRegistration
}
