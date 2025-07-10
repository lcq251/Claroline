import React, {useMemo} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {useReducer} from '#/main/app/store/hooks/useReducer'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {makeListReducer} from '#/main/app/content/list'
import {route} from '#/main/core/tool'

import {MODAL_GROUPS} from '#/main/community/modals/groups'
import {GroupList} from '#/main/community/group/components/list'

const UserGroups = (props) => {
  const listName = 'profileGroups'
  // append list reducer to the store if not already mounted
  const reducer = useMemo(() => makeListReducer(listName), [listName])
  useReducer(listName, reducer)

  return (
    <>
      {props.addGroups && hasPermission('administrate', props.user) &&
        <Button
          className="btn btn-primary mt-4 me-auto"
          {...{
            name: 'add',
            type: MODAL_BUTTON,
            // icon: 'fa fa-fw fa-plus',
            label: trans('add_group', {}, 'actions'),
            displayed: hasPermission('administrate', props.user),
            modal: [MODAL_GROUPS, {
              selectAction: (groups) => ({
                type: CALLBACK_BUTTON,
                label: trans('add', {}, 'actions'),
                callback: () => props.addGroups(props.user.id, groups.map(group => group.id))
              })
            }]
          }}
        />
      }

      <GroupList
        className="mt-4 mb-5"
        path={route('community', props.path)}
        name={listName}
        url={['apiv2_user_list_groups', {id: props.user.id}]}
        autoload={!!props.user.id}
        delete={{
          url: ['apiv2_user_remove_groups', {id: props.user.id}],
          icon: 'fa fa-fw fa-times',
          label: trans('remove', {}, 'actions'),
          displayed: () => hasPermission('administrate', props.user)
        }}
        actions={undefined}
      />
    </>
  )
}

UserGroups.propTypes = {
  path: T.string.isRequired,
  user: T.object,
  addGroups: T.func
}

export {
  UserGroups
}
