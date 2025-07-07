import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {EditorActions} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security'
import {selectors as contextSelectors} from '#/main/app/context'

import {getActions} from '#/main/core/tool/utils'
import {selectors} from '#/main/core/tool/editor/store'

const ToolEditorActions = () => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const contextPath = useSelector(contextSelectors.path)

  const tool = useSelector(selectors.tool)

  const toolActions = useMemo(() => {
    if (!isEmpty(tool)) {
      return getActions([tool], {}, contextPath, currentUser)
    }

    return []
  }, [tool])

  return (
    <EditorActions
      actions={toolActions}
    />
  )
}

export {
  ToolEditorActions
}
