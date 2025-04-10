import React, {useMemo} from 'react'
import {PropTypes as T} from 'prop-types'

import {Activity} from '#/main/log/activity/components/main'
import {makeListReducer} from '#/main/app/content/list'
import {useReducer} from '#/main/app/store/hooks/useReducer'

import {User as UserTypes} from '#/main/community/user/prop-types'

const UserActivity = (props) => {
  const listName = 'profileActivity'
  // append list reducer to the store if not already mounted
  const reducer = useMemo(() => makeListReducer(listName, {
    sortBy: { property: 'date', direction: -1 }
  }), [listName])
  useReducer(listName, reducer)

  return (
    <Activity
      name={listName}
      url={['apiv2_logs_functional_list_user', {userId: props.user.id}]}
    />
  )
}

UserActivity.propTypes = {
  user: T.shape(
    UserTypes.propTypes
  ).isRequired
}

export {
  UserActivity
}
