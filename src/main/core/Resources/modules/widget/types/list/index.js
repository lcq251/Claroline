
import {ListWidget} from '#/main/core/widget/types/list/containers/widget'
import {ListWidgetParameters} from '#/main/core/widget/types/list/containers/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: ListWidgetParameters
})

/**
 * List widget application.
 */
export const App = () => ({
  component: ListWidget
})

export default declareWidget(ListWidget, ListWidgetParameters)
