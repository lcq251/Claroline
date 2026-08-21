import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineMindMeAiBundle', {
  resources: {
    ai_lesson: () => import('#/integration/mindme-ai/resources/ai-lesson'),
    mindme_markdown: () => import('#/integration/mindme-ai/resources/mindme-markdown')
  },
  widgets: {
    'landing-hero'             : () => { return import(/* webpackChunkName: "mindme-landing-hero" */           '#/integration/mindme-ai/widgets/landing/hero') },
    'landing-features'         : () => { return import(/* webpackChunkName: "mindme-landing-features" */       '#/integration/mindme-ai/widgets/landing/features') },
    'landing-packaging'        : () => { return import(/* webpackChunkName: "mindme-landing-packaging" */      '#/integration/mindme-ai/widgets/landing/packaging') },
    'dashboard-overview'       : () => { return import(/* webpackChunkName: "mindme-dashboard-overview" */     '#/integration/mindme-ai/widgets/dashboard/overview') },
    'dashboard-messages'       : () => { return import(/* webpackChunkName: "mindme-dashboard-messages" */       '#/integration/mindme-ai/widgets/dashboard/messages') },
    'dashboard-recommendations' : () => { return import(/* webpackChunkName: "mindme-dashboard-recommendations" */ '#/integration/mindme-ai/widgets/dashboard/recommendations') },
    'dashboard-workspace-tree' : () => { return import(/* webpackChunkName: "mindme-dashboard-workspace-tree" */ '#/integration/mindme-ai/widgets/dashboard/workspace-tree') }
  }
})