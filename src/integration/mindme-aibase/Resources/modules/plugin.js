import {registry} from '#/main/app/plugins/registry'

registry.add('MindmeAibaseBundle', {
  resources: {
    aibase: () => import('#/integration/mindme-aibase/resources/aibase')
  }
})