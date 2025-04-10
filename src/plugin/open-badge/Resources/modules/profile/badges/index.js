
import {trans} from '#/main/app/intl'
import {declareProfile} from '#/main/community/user'

import {ProfileBadges} from '#/plugin/open-badge/profile/badges/components/main'

export default declareProfile(ProfileBadges, {
  name: 'badges',
  title: trans('badges', {}, 'badge')
})