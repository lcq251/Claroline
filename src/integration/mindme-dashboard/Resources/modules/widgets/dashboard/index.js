/*
 * Dashboard widget registrations for the Desktop homepage.
 * Registers overview + messages blocks alongside the existing workspace-tree.
 */

import { OverviewWidget } from './dashboard/overview'
import { MessagesWidget } from './dashboard/messages'
import { WorkspaceTreeWidget } from './dashboard/workspace-tree'

export const dashboardWidgets = [
  WorkspaceTreeWidget,
  OverviewWidget,
  MessagesWidget,
]

export default dashboardWidgets
