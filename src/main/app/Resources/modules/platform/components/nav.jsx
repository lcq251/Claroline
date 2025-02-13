import React, {useId, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {route} from '#/main/core/workspace/routing'
import {Thumbnail} from '#/main/app/components/thumbnail'

import {MODAL_CONTEXT_SEARCH} from '#/main/app/context/modals/search'

import {selectors} from '#/main/app/platform/store'
import {ContextUser} from '#/main/app/context/containers/user'
import {MODAL_PLATFORM_HELP} from '#/main/app/platform/modals/help'

const PlatformNav = (props) => {
  let pinnedContexts = [].concat(props.favoriteContexts)
  if (!isEmpty(props.currentContext) && 'workspace' === props.currentContextType) {
    let currentPos = pinnedContexts.findIndex((context) => context.id === props.currentContext.id)
    if (-1 === currentPos) {
      pinnedContexts.unshift(props.currentContext)
    }
  }

  const currentOrganization = useSelector(selectors.currentOrganization)

  const navTitleId = useId()

  const quickAccessTitleId = useId()
  const quickAccessDescId = useId()
  const [quickAccess, setQuickAccess] = useState(false)

  return (
    <nav
      className="app-contexts app-toolbar"
      aria-labelledby={navTitleId}
    >
      <h1 id={navTitleId} className="visually-hidden">{trans('main_menu')}</h1>

      <h2 id={quickAccessTitleId} className="visually-hidden">{trans('quick_access_links')}</h2>
      <p id={quickAccessDescId} className="visually-hidden">{trans('quick_access_links_help')}</p>
      <ul
        className={classes('list-unstyled d-flex flex-column gap-2 mb-0', {
          'visually-hidden': !quickAccess
        })}
        aria-labelledby={quickAccessTitleId}
        aria-describedby={quickAccessDescId}
      >
        <li>
          <Button
            type={CALLBACK_BUTTON}
            className="app-context-btn focus-ring"
            icon="fa fa-fw fa-font"
            label={trans('go_to_content', {}, 'actions')}
            tooltip="right"
            callback={() => document.querySelector('.app-page-body').focus()}
            onFocus={() => {
              setQuickAccess(true)
            }}
          />
        </li>
        <li>
          <Button
            type={CALLBACK_BUTTON}
            className="app-context-btn focus-ring"
            icon="fa fa-fw fa-book"
            label={trans('go_to_context_menu', {}, 'actions')}
            tooltip="right"
            callback={() => document.querySelector('.app-context-menu-toggle').focus()}
            onFocus={() => {
              setQuickAccess(true)
            }}
          />
        </li>
        <li>
          <Button
            type={CALLBACK_BUTTON}
            className="app-context-btn focus-ring"
            icon="fa fa-fw fa-tools"
            label={trans('go_to_tool_menu', {}, 'actions')}
            tooltip="right"
            callback={() => document.querySelector('.app-page-body').focus()}
            onFocus={() => {
              setQuickAccess(true)
            }}
          />
        </li>
      </ul>
      <hr
        className={classes('app-context-separator mx-auto', {
          'visually-hidden': !quickAccess
        })}
        aria-hidden={true}
      />

      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
        <li>
          <Button
            type={LINK_BUTTON}
            className="app-context-btn position-relative focus-ring"
            label={trans('desktop', {}, 'context')}
            tooltip="right"
            target="/desktop"
          >
            <Thumbnail
              size="sm"
              thumbnail={currentOrganization.thumbnail}
              name={currentOrganization.name}
              square={true}
            />
          </Button>
        </li>
        <li>
          <div role="search">
            <Button
              type={MODAL_BUTTON}
              className="app-context-btn focus-ring"
              icon="far fa-fw fa-compass"
              label={trans('search_and_history')}
              tooltip="right"
              modal={[MODAL_CONTEXT_SEARCH]}
            />
          </div>
        </li>
      </ul>

      <hr className="app-context-separator mx-auto" aria-hidden={true} />

      {0 !== pinnedContexts.length &&
        <>
          <h2 className="visually-hidden">{trans('my_favourite_workspaces')}</h2>
          <p className="visually-hidden">{trans('my_favourite_workspaces_help')}</p>
          <ul className="list-unstyled d-flex flex-column gap-2 mb-0 flex-fill">
            {pinnedContexts.map(pinnedContext => (
              <li key={pinnedContext.id || trans('loading')}>
                <Button
                  type={LINK_BUTTON}
                  className="app-context-btn position-relative focus-ring"
                  label={pinnedContext.name || trans('loading')}
                  tooltip="right"
                  target={route(pinnedContext)}
                >
                  <Thumbnail
                    size="sm"
                    thumbnail={pinnedContext.thumbnail}
                    name={pinnedContext.name}
                    square={true}
                  />
                </Button>
              </li>
            ))}
          </ul>
        </>
      }

      <hr className="app-context-separator mt-auto mx-auto" aria-hidden={true} />
      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
        <li>
          <ContextUser className="app-context-btn" />
        </li>

        <li>
          <div role="contentinfo">
            <Button
              type={MODAL_BUTTON}
              className="app-context-btn focus-ring"
              icon="fa fa-question"
              label={trans('Centre d\'aide')}
              tooltip="right"
              modal={[MODAL_PLATFORM_HELP]}
            />
          </div>
        </li>
      </ul>
    </nav>
  )
}

PlatformNav.propTypes = {
  currentUser: T.shape({

  }).isRequired,
  currentContext: T.shape({
    id: T.string
  }),
  currentContextType: T.string,

  availableContexts: T.arrayOf(T.shape({

  })),
  favoriteContexts: T.arrayOf(T.shape({
    id: T.string.isRequired,
    slug: T.string.isRequired,
    name: T.string.isRequired,
    thumbnail: T.string
  }))
}

export {
  PlatformNav
}
