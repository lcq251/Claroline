import {trans} from '#/main/app/intl'
import {declareAccount} from '#/main/community/user'

import {TosMain} from '#/main/privacy/account/tos/containers/main'

export default declareAccount(TosMain, {
  name: 'terms',
  title: trans('terms_of_service', {}, 'privacy'),
  help: trans('Lorem ipsum dolor sit amet.'),
  group: trans('legal_information')
})
