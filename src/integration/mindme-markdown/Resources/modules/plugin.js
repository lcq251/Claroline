import {registry} from '#/main/app/plugins/registry'

registry.add('MindmeMarkdownBundle', {
  resources: {
    mindme_markdown: () => import('#/integration/mindme-markdown/resources/mindme-markdown')
  },
  widgets: {
    'markdown': () => { return import(/* webpackChunkName: "mindme-widget-markdown" */ '#/integration/mindme-markdown/widgets/markdown') }
  }
})