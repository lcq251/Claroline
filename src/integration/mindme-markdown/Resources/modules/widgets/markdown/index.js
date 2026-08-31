import {MarkdownWidget} from './containers/main'
import {MarkdownWidgetParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: MarkdownWidgetParameters
})

export const App = () => ({
  component: MarkdownWidget
})

export default declareWidget(MarkdownWidget, MarkdownWidgetParameters)