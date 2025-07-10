import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {useReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {User as UserTypes} from '#/main/community/user/prop-types'
import {selectors} from '#/main/app/context'

import {AssertionBadgeCard} from '#/plugin/open-badge/assertion/components/card'
import {AssertionList} from '#/plugin/open-badge/assertion/components/list'
import {route} from '#/main/core/tool'

const ProfileBadges = (props) => {
  const listName = 'profileBadges'
  // append list reducer to the store if not already mounted
  const reducer = useMemo(() => makeListReducer(listName, {
    sortBy: {property: 'name', direction: 1}
  }), [listName])
  useReducer(listName, reducer)

  const contextPath = useSelector(selectors.path)
  const contextType = useSelector(selectors.type)
  const contextData = useSelector(selectors.data)

  return (
    <AssertionList
      className="mt-4 mb-5"
      path={route('badges', contextPath)}
      name={listName}
      url={['apiv2_badge_assertion_user_list', {
        workspaceId: 'workspace' === contextType ? contextData.id : null,
        userId: props.user.id
      }]}
      customDefinition={[
        {
          name: 'badge.name',
          type: 'string',
          label: trans('name'),
          displayed: true,
          primary: true
        }, {
          name: 'issuedOn',
          label: trans('granted_date', {}, 'badge'),
          type: 'date',
          displayed: true,
          primary: true,
          options: {
            time: true
          }
        }, {
          name: 'badge.archived',
          type: 'boolean',
          label: trans('archived'),
          displayed: true
        }
      ]}
      actions={undefined}
      card={AssertionBadgeCard}
    />
  )
}

ProfileBadges.propTypes = {
  path: T.string.isRequired,
  user: T.shape(
    UserTypes.propTypes
  ).isRequired
}

export {
  ProfileBadges
}
