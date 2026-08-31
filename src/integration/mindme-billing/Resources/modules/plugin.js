import {registry} from '#/main/app/plugins/registry'

import {trans} from '#/main/app/intl/translation'

registry.add('MindmeBillingBundle', {
  // 资源配置弹窗通用「关联产品」页（作为资源的一个维度，核心 ResourceEditor 注入）。
  // 注意：component 必须是 lazy loader（() => import(...)），由核心 concat 时
  // React.lazy 包裹 —— 绝不能在 plugin.js 顶层静态 import 组件树。
  editorPages: {
    product: {
      name: 'product',
      title: trans('publish_products', {}, 'resource'),
      component: () => import(/* webpackChunkName: "mindme-editor-product-page" */ '#/integration/mindme-billing/resource/editor/pages/product')
    }
  }
})