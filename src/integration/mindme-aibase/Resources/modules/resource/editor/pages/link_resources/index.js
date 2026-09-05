/**
 * 通用「关联资源」资源配置页入口（供 editorPages.link_resources 懒加载）。
 *
 * 必须同时提供 default export（指向 React 组件本身）—— React.lazy 要求
 * `() => import()` 解析出的 module 有 `.default` 字段，缺了它会触发
 * React #306 "Element type is invalid: expected a string ... but got: undefined"。
 * named export 保留向后兼容。
 */

import {LinkResourcesEditorPage} from '#/integration/mindme-aibase/resource/editor/pages/link_resources/components/main'

export {
  LinkResourcesEditorPage
}

export default LinkResourcesEditorPage