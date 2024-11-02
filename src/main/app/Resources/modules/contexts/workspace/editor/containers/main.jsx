import {withReducer} from '#/main/app/store/reducer'


import {WorkspaceEditor as WorkspaceEditorComponent} from '#/main/app/contexts/workspace/editor/components/main'
import {reducer, selectors} from '#/main/app/contexts/workspace/editor/store'

const WorkspaceEditor = withReducer(selectors.STORE_NAME, reducer)(WorkspaceEditorComponent)

export {
  WorkspaceEditor
}
