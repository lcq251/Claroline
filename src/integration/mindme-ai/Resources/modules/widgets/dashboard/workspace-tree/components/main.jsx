/*
 * dashboard-workspace-tree widget: collapsible tree of user workspaces
 * and their root-level accessible resources.
 *
 * data.tree[] injected by the backend serializer. Empty tree suppresses the
 * widget entirely (same pattern as shortcuts widget §3.6).
 */

import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'
import {Tree} from '#/main/app/components/tree'
import {LINK_BUTTON} from '#/main/app/buttons'

import {BlockHead} from '../../common/block'

const PREFIX = 'claroline-distribution-integration-mindme-ai-dashboard-dashboard-workspace-tree'

const WorkspaceTreeComponent = props => {
  const parameters = props.parameters || {}
  const data = parameters.data || {}
  const tree = Array.isArray(data.tree) ? data.tree : []
  const maxResources = data.maxResources || 5

  // empty tree hide widget
  if (0 === tree.length) {
    return null
  }

  const items = tree.map(ws => ({
    id: ws.id,
    label: ws.name,
    type: LINK_BUTTON,
    target: ws.url || '#',
    children: (ws.resources || []).slice(0, maxResources).map(r => ({
      id: r.id,
      label: r.name,
      type: LINK_BUTTON,
      target: r.url || '#'
    })).concat(
      (ws.resources || []).length > maxResources
        ? [{
            id: ws.id + '-more',
            label: trans('dashboard_workspace_more_resources', {}, 'widget'),
            type: LINK_BUTTON,
            target: ws.url || '#'
          }]
        : []
    )
  }))

  return (
    <section className={PREFIX} aria-label={trans('dashboard_block_workspace_tree', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_block_workspace_tree', {}, 'widget')}
        en="My Workspaces"
      />

      <Tree
        className="workspace-tree"
        items={items}
        size="sm"
      />
    </section>
  )
}

WorkspaceTreeComponent.propTypes = {
  parameters: T.shape({
    data: T.shape({
      tree: T.arrayOf(T.shape({
        id: T.string,
        name: T.string,
        code: T.string,
        url: T.string,
        resources: T.arrayOf(T.shape({
          id: T.string,
          name: T.string,
          type: T.string,
          url: T.string
        }))
      })),
      maxResources: T.number
    })
  })
}

const WorkspaceTree = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(WorkspaceTreeComponent)

export {
  WorkspaceTree
}