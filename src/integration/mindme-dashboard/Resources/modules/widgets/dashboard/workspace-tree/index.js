import {WorkspaceTree} from './components/main'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: () => null   // no admin config panel
})

export const App = () => ({
  component: WorkspaceTree,
  styles: ['claroline-distribution-integration-mindme-dashboard']
})

export default declareWidget(WorkspaceTree, () => null)