import {trans} from '#/main/app/intl'
import {declareAccount} from '#/main/community/user'

import {AccountHistory} from '#/main/core/account/history/components/main'

export default declareAccount(AccountHistory, {
  name: 'my-history', // ATTENTION: UserEditor contains a history page for operational logs
  title: trans('history', {}, 'workspace'),
  group: trans('preferences')
})
