import React, {useMemo} from 'react'

import {useReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {constants as listConst} from '#/main/app/content/list/constants'

import {WorkspaceList} from '#/main/core/workspace/components/list'

const ProfileWorkspaces = (props) => {
  const listName = 'profileWorkspaces'
  // append list reducer to the store if not already mounted
  const reducer = useMemo(() => makeListReducer(listName), [listName])
  useReducer(listName, reducer)

  //const currentUser(selectors)

  return (
    <WorkspaceList
      flush={true}
      url={['apiv2_workspace_list_registered', {userId}]}
      autoload={!!currentUser}
      name={listName}
      refresher={refresher}
      display={{
        current: listConst.DISPLAY_TILES_SM
      }}
      /*addAction={{
        name: 'add',
        type: MODAL_BUTTON,
        // icon: 'fa fa-fw fa-plus',
        label: trans('add_workspace', {}, 'actions'),
        displayed: props.canCreate,
        modal: [MODAL_WORKSPACE_CREATION]
      }}*/
    />
  )
}

export {
  ProfileWorkspaces
}
