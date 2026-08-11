import {Notifications} from './components/main'
import {NotificationsParameters} from './components/parameters'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({
  component: NotificationsParameters
})

/**
 * Desktop dashboard notifications widget (C-22).
 */
export const App = () => ({
  component: Notifications,
  styles: ['claroline-distribution-integration-mindme-ai-dashboard']
})

export default declareWidget(Notifications, NotificationsParameters)
