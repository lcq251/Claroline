/*
 * 资源配置弹窗「关联产品」页（懒加载 chunk 入口）。
 *
 * 本文件被 mindme-billing plugin.js 的 editorPages.product.component loader
 * 动态 import() 引用，因此必须 **default export 组件**（React.lazy 契约：
 * loader → import() → 模块 .default 即组件）。页标题由 plugin.js 注册
 * 描述时提供，不在本文件求值。
 */

import {ProductEditorPage} from './components/main'

export default ProductEditorPage