import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineMindMeAiBundle', {
  resources: {
    ai_lesson: () => import('#/integration/mindme-ai/resources/ai-lesson')
  },
  widgets: {
    'landing-hero'     : () => { return import(/* webpackChunkName: "mindme-landing-hero" */      '#/integration/mindme-ai/widgets/landing/hero') },
    'landing-features' : () => { return import(/* webpackChunkName: "mindme-landing-features" */  '#/integration/mindme-ai/widgets/landing/features') },
    'landing-packaging': () => { return import(/* webpackChunkName: "mindme-landing-packaging" */ '#/integration/mindme-ai/widgets/landing/packaging') }
  }
})
