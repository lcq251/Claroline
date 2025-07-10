import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {ToolPage} from '#/main/core/tool'

import {User as UserTypes} from '#/main/community/user/prop-types'
import {route} from '#/main/community/user/routing'
import {getActions} from '#/main/community/user/utils'
import {UserProfile} from '#/main/community/user/components/profile'

const UserShow = (props) => {
  return (
    <ToolPage
      title={trans('user_name', {name: get(props.user, 'name', trans('loading'))}, 'community')}
      description={get(props.user, 'meta.description')}
    >
      <UserProfile
        path={props.path}
        user={props.user}
        addGroups={props.addGroups}
        primaryAction="send-message"
        actions={getActions([props.user], {
          add: () => props.reload(props.user.id),
          update: () => props.reload(props.user.id),
          delete: () => props.reload(props.user.id)
        }, props.path, props.currentUser)}
      />
    </ToolPage>
  )
}

UserShow.propTypes = {
  path: T.string.isRequired,
  user: T.shape(
    UserTypes.propTypes
  ),
  currentUser: T.object,
  reload: T.func.isRequired,
  addGroups: T.func.isRequired
}

export {
  UserShow
}
