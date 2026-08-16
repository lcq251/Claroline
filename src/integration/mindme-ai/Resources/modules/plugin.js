import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineMindMeAiBundle', {
  resources: {
    ai_lesson: () => import('#/integration/mindme-ai/resources/ai-lesson'),
    mindme_markdown: () => import('#/integration/mindme-ai/resources/mindme-markdown')
  },
  widgets: {
    'landing-hero'     : () => { return import(/* webpackChunkName: "mindme-landing-hero" */      '#/integration/mindme-ai/widgets/landing/hero') },
    'landing-features' : () => { return import(/* webpackChunkName: "mindme-landing-features" */  '#/integration/mindme-ai/widgets/landing/features') },
    'landing-packaging': () => { return import(/* webpackChunkName: "mindme-landing-packaging" */ '#/integration/mindme-ai/widgets/landing/packaging') },
    'dashboard-board'          : () => { return import(/* webpackChunkName: "mindme-dashboard-board" */           '#/integration/mindme-ai/widgets/dashboard/board') },
    'dashboard-recommendations': () => { return import(/* webpackChunkName: "mindme-dashboard-recommendations" */ '#/integration/mindme-ai/widgets/dashboard/recommendations') },
    'dashboard-notifications'  : () => { return import(/* webpackChunkName: "mindme-dashboard-notifications" */   '#/integration/mindme-ai/widgets/dashboard/notifications') },
    'dashboard-shortcuts'      : () => { return import(/* webpackChunkName: "mindme-dashboard-shortcuts" */       '#/integration/mindme-ai/widgets/dashboard/shortcuts') },
    'dashboard-fees'           : () => { return import(/* webpackChunkName: "mindme-dashboard-fees" */            '#/integration/mindme-ai/widgets/dashboard/fees') }
  }
})