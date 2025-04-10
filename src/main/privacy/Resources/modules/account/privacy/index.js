import {trans} from '#/main/app/intl'
import {declareAccount} from '#/main/community/user'

import {PrivacyMain} from '#/main/privacy/account/privacy/components/main'

export default declareAccount(PrivacyMain, {
  name: 'privacy',
  title: trans('privacy_policy', {}, 'privacy'),
  group: trans('legal_information')
})
