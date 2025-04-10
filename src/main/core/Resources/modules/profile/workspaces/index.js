import {declareProfile} from '#/main/community/user'
import {ProfileWorkspaces} from '#/main/core/profile/workspaces/components/main'
import {trans} from '#/main/app/intl'

export default declareProfile(ProfileWorkspaces, {
  name: 'workspaces',
  title: trans('workspaces', {}, 'workspace')
})