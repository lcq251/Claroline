import React, {useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {EditorActions} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool'
import {route as workspaceRoute} from '#/main/core/workspace'

import {route} from '#/main/core/resource/routing'
import {getActions} from '#/main/core/resource/utils'
import {actions, selectors} from '#/main/core/resource/editor/store'

const ResourceEditorActions = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const currentUser = useSelector(securitySelectors.currentUser)
  const toolPath = useSelector(toolSelectors.path)

  const formData = useSelector(selectors.data)
  const editedNode = useSelector(selectors.resourceNode)

  const refresher = {
    add: () => true,
    update: (resourceNodes) => {
      // checks if the action has modified the current node
      const currentNode = resourceNodes.find(node => node.id === editedNode.id)
      if (currentNode) {
        dispatch(actions.reset(merge({}, omit(formData, 'resourceNode'), {resourceNode: currentNode})))
      }
    },
    delete: (resourceNodes) => {
      // checks if the action has deleted the current node
      const currentNode = resourceNodes.find(node => node.id === editedNode.id)
      if (currentNode) {
        let redirect
        if (currentNode.parent) {
          redirect = route(currentNode.parent)
        } else {
          redirect = workspaceRoute(currentNode.workspace, 'resources')
        }

        history.push(redirect)
      }
    }
  }

  const resourceActions = useMemo(() => {
    if (!isEmpty(editedNode)) {
      return getActions([editedNode], refresher, toolPath, currentUser)
    }

    return []
  }, [editedNode])

  return (
    <EditorActions
      actions={resourceActions}
    />
  )
}

export {
  ResourceEditorActions
}
