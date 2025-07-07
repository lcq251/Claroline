import React, {useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {EditorActions} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool'

import {actions, selectors} from '#/main/community/user/editor/store'
import {getActions} from '#/main/community/user/utils'

const UserEditorActions = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const currentUser = useSelector(securitySelectors.currentUser)
  const toolPath = useSelector(toolSelectors.path)

  const user = useSelector(selectors.user)

  const refresher = {
    add: () => true,
    update: (users) => {
      // checks if the action has modified the current context
      const editedUser = users.find(u => u.id === get(user, 'id'))
      if (editedUser) {
        dispatch(actions.reset(editedUser))
      }
    },
    delete: (users) => {
      // checks if the action has deleted the current node
      const editedUser = users.find(u => u.id === get(user, 'id'))
      if (editedUser) {
        history.push(toolPath+'/users')
      }
    }
  }

  const userActions = useMemo(() => {
    if (!isEmpty(user)) {
      return getActions([user], refresher, toolPath, currentUser)
    }

    return []
  }, [user])

  return (
    <EditorActions
      actions={userActions}
    />
  )
}

export {
  UserEditorActions
}
