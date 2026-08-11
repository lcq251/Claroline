import {Board} from './components/main'
import {BoardParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: BoardParameters
})

/**
 * Desktop dashboard board widget (role-based metric board, C-22).
 */
export const App = () => ({
  component: Board,
  styles: ['claroline-distribution-integration-mindme-ai-dashboard']
})

export default declareWidget(Board, BoardParameters)
