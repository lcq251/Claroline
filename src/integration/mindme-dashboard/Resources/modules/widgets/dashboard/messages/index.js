/*
 * dashboard-messages widget: platform messages & notifications list.
 */

import {MessagesBlock} from './components/main'
import {declareWidget} from '#/main/core/widget'

export const Parameters = () => ({component: () => null})

export const App = () => ({
  component: MessagesBlock,
  styles: ['claroline-distribution-integration-mindme-dashboard']
})

export default declareWidget(MessagesBlock, () => null)
