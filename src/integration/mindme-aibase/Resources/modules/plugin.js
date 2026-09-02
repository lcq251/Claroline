import {registry} from '#/main/app/plugins/registry'

import {trans} from '#/main/app/intl/translation'

registry.add('MindmeAibaseBundle', {
  resources: {
    aibase: () => import('#/integration/mindme-aibase/resources/aibase')
  },
  // 通用「关联资源」资源配置页。按 resourceTypes 白名单决定哪些资源类型显示该菜单。
  // 未配置 resourceTypes → 全部类型显示；[] → 全部不显示。
  editorPages: {
    link_resources: {
      name: 'link_resources',
      title: trans('link_resources', {}, 'resource'),
      resourceTypes: ['claroline_web_resource', 'aibase'],
      component: () => import(/* webpackChunkName: "mindme-editor-link-resources-page" */ '#/integration/mindme-aibase/resource/editor/pages/link_resources')
    }
  }
})