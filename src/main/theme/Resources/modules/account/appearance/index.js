import {trans} from '#/main/app/intl'
import {declareAccount} from '#/main/community/user'

import {AppearanceMain} from '#/main/theme/account/appearance/components/main'

export default declareAccount(AppearanceMain, {
  name: 'appearance',
  title: trans('appearance', {}, 'tools'),
  group: trans('preferences')
})
