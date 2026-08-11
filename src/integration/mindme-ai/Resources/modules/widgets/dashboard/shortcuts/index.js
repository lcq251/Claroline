import {Shortcuts} from './components/main'
import {ShortcutsParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: ShortcutsParameters
})

/**
 * Desktop dashboard shortcuts widget (quick tiles, C-22).
 */
export const App = () => ({
  component: Shortcuts,
  styles: ['claroline-distribution-integration-mindme-ai-dashboard']
})

export default declareWidget(Shortcuts, ShortcutsParameters)
