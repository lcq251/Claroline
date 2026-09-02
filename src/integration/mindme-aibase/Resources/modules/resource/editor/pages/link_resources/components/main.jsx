/**
 * 通用「关联资源」编辑页（资源配置弹窗的一个维度）。
 *
 * 由任意插件通过 `editorPages.link_resources` 注册，核心 ResourceEditor
 * 消费后按 `resourceTypes` 白名单过滤显示：
 *   - 未配置 resourceTypes → 所有资源类型显示
 *   - 配置了数组 → 仅在数组列出的资源类型显示
 *
 * 页面本身完全不绑定具体资源类型，hostId 取自当前资源节点 uuid，
 * 底层复用通用 ResourceInputsEditor（ResourceReference API）。
 */

import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor/components/page'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {ResourceInputsEditor} from '#/integration/mindme-aibase/resource/inputs'

const LinkResourcesEditorPage = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const hostId = get(resourceNode, 'id')

  if (!hostId) {
    return null
  }

  return (
    <EditorPage title={trans('link_resources', {}, 'resource')}>
      <ResourceInputsEditor hostId={hostId} />
    </EditorPage>
  )
}

export {
  LinkResourcesEditorPage
}