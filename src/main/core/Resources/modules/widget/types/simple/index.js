
import {SimpleWidget} from '#/main/core/widget/types/simple/containers/widget'
import {SimpleWidgetParameters} from '#/main/core/widget/types/simple/components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: SimpleWidgetParameters
})

/**
 * Simple widget application.
 */
export const App = () => ({
  component: SimpleWidget
})

export default declareWidget(SimpleWidget, SimpleWidgetParameters)
