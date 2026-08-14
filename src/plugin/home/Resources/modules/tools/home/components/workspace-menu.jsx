import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {route} from '#/main/core/workspace/routing'

/**
 * Workspace quick menu displayed on the desktop home page only.
 *
 * It shows 3 groups of workspaces :
 *  - my workspaces (registered + personal)
 *  - public workspaces (is_public = true)
 *  - favorites (contextFavorites injected at login)
 */
const WorkspaceMenu = (props) => {
  const groups = [
    {
      key: 'my-workspaces',
      title: trans('my_workspaces_menu', {}, 'workspace'),
      workspaces: props.myWorkspaces
    }, {
      key: 'public-workspaces',
      title: trans('public_workspaces_menu', {}, 'workspace'),
      workspaces: props.publicWorkspaces
    }, {
      key: 'favorites',
      title: trans('favorites', {}, 'home'),
      workspaces: props.favorites
    }
  ]

  return (
    <nav
      className="app-workspace-menu position-fixed end-0 z-3 d-flex flex-column gap-3 p-3 bg-body border rounded shadow-sm me-3"
      aria-label={trans('workspaces', {}, 'workspace')}
    >
      {groups.map(group => (
        <section key={group.key} className="app-workspace-menu-section">
          <h2 className="fs-6 fw-bold text-uppercase text-muted mb-2">{group.title}</h2>
          <ul className="app-main-menu-group list-unstyled d-flex flex-column gap-2 mb-0">
            {group.workspaces.map(workspace => (
              <li key={workspace.id || workspace.slug || group.key + '-loading'}>
                <Button
                  type={LINK_BUTTON}
                  className="app-context-btn position-relative focus-ring"
                  label={workspace.name || trans('loading')}
                  tooltip="right"
                  target={route(workspace)}
                >
                  <Thumbnail
                    size="sm"
                    thumbnail={workspace.thumbnail}
                    name={workspace.name}
                    square={true}
                  />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  )
}

WorkspaceMenu.propTypes = {
  myWorkspaces: T.arrayOf(T.shape({
    id: T.string,
    slug: T.string,
    name: T.string,
    thumbnail: T.string
  })),
  publicWorkspaces: T.arrayOf(T.shape({
    id: T.string,
    slug: T.string,
    name: T.string,
    thumbnail: T.string
  })),
  favorites: T.arrayOf(T.shape({
    id: T.string,
    slug: T.string,
    name: T.string,
    thumbnail: T.string
  }))
}

WorkspaceMenu.defaultProps = {
  myWorkspaces: [],
  publicWorkspaces: [],
  favorites: []
}

export {
  WorkspaceMenu
}
