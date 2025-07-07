import React, {useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {EditorActions} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool'

import {selectors, actions} from '#/main/evaluation/sequence/editor/store'
import {getActions} from '#/main/evaluation/sequence/utils'

const SequenceEditorActions = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const currentUser = useSelector(securitySelectors.currentUser)
  const toolPath = useSelector(toolSelectors.path)

  const sequence = useSelector(selectors.data)

  const refresher = {
    add: () => true,
    update: (sequences) => {
      // checks if the action has modified the current context
      const currentSequence = sequences.find(s => s.id === get(sequence, 'id'))
      if (currentSequence) {
        dispatch(actions.reset(currentSequence))
      }
    },
    delete: (sequences) => {
      // checks if the action has deleted the current node
      const currentSequence = sequences.find(s => s.id === get(sequence, 'id'))
      if (currentSequence) {
        history.push(toolPath)
      }
    }
  }

  const sequenceActions = useMemo(() => {
    if (!isEmpty(sequence)) {
      return getActions([sequence], refresher, toolPath, currentUser)
    }

    return []
  }, [sequence])

  return (
    <EditorActions
      actions={sequenceActions}
    />
  )
}

export {
  SequenceEditorActions
}
