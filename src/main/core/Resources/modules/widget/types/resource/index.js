
import {ResourceWidget} from '#/main/core/widget/types/resource/containers/widget'
import {ResourceWidgetParameters} from '#/main/core/widget/types/resource/components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: ResourceWidgetParameters
})

/**
 * Resource widget application.
 */
export const App = () => ({
  component: ResourceWidget
})

export default declareWidget(ResourceWidget, ResourceWidgetParameters)
