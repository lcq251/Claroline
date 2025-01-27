import React from 'react'
import get from 'lodash/get'
import {useSelector} from 'react-redux'

import {Thumbnail} from '#/main/app/components/thumbnail'
import {ContextEditor, selectors} from '#/main/app/context/editor'

import {WorkspaceEditorOverview} from '#/main/app/contexts/workspace/editor/components/overview'
import {WorkspaceEditorAppearance} from '#/main/app/contexts/workspace/editor/components/appearance'
import {WorkspaceEditorActions} from '#/main/app/contexts/workspace/editor/components/actions'
import {WorkspaceEditorPermissions} from '#/main/app/contexts/workspace/editor/components/permissions'

const WorkspaceEditor = () => {
  const context = useSelector(selectors.context)

  return (
    <ContextEditor
      thumbnail={
        <Thumbnail
          className="rounded-1"
          thumbnail={get(context, 'thumbnail')}
          name={get(context, 'name')}
          size="sm"
          loaded={!!context}
        />
      }
      overviewPage={WorkspaceEditorOverview}
      appearancePage={WorkspaceEditorAppearance}
      permissionsPage={WorkspaceEditorPermissions}
      actionsPage={WorkspaceEditorActions}
    />
  )
}

export {
  WorkspaceEditor
}
