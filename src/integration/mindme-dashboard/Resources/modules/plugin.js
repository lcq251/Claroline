import {registry} from '#/main/app/plugins/registry'

registry.add('MindmeDashboardBundle', {
  widgets: {
    'dashboard-overview'         : () => { return import(/* webpackChunkName: "mindme-dashboard-overview" */         '#/integration/mindme-dashboard/widgets/dashboard/overview') },
    'dashboard-workspace-tree'   : () => { return import(/* webpackChunkName: "mindme-dashboard-workspace-tree" */   '#/integration/mindme-dashboard/widgets/dashboard/workspace-tree') },
    'dashboard-messages'         : () => { return import(/* webpackChunkName: "mindme-dashboard-messages" */         '#/integration/mindme-dashboard/widgets/dashboard/messages') },
    'dashboard-recommendations'  : () => { return import(/* webpackChunkName: "mindme-dashboard-recommendations" */  '#/integration/mindme-dashboard/widgets/dashboard/recommendations') }
  }
})