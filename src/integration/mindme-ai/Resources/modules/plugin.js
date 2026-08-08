import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineMindMeAiBundle', {
  resources: {
    ai_lesson: () => import('#/integration/mindme-ai/resources/ai-lesson')
  },
  widgets: {
    dashboard: () => import('#/integration/mindme-ai/widgets/dashboard')
  }
})
