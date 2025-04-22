import {trans} from '#/main/app/intl'
import {declareAccount} from '#/main/community/user'

import {AccountFavourites} from '#/main/core/account/favourites/components/main'

export default declareAccount(AccountFavourites, {
  name: 'favourites',
  title: trans('favourites', {}, 'workspace'),
  group: trans('preferences')
})
