import {trans} from '#/main/app/intl'
import {declareAccount} from '#/main/community/user'

import {AccountAuthentication} from '#/main/authentication/account/authentication/containers/main'

export default declareAccount(AccountAuthentication, {
  name: 'authentication',
  title: trans('authentication', {}, 'tools')
})
