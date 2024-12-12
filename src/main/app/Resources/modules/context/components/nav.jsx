import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {route} from '#/main/core/workspace/routing'
import {Thumbnail} from '#/main/app/components/thumbnail'

import {MODAL_CONTEXT_SEARCH} from '#/main/app/context/modals/search'
import {NotificationButton} from '#/main/notification/components/button'
//import {PlatformOrganization} from '#/main/app/platform/components/organization'
import {useSelector} from 'react-redux'
import {selectors} from '#/main/app/platform/store'
import {ContextUser} from '#/main/app/context/containers/user'

const ContextNav = (props) => {
  if (!props.currentUser) {
    return null
  }

  let pinnedContexts = [].concat(props.favoriteContexts)
  if (!isEmpty(props.currentContext) && 'workspace' === props.currentContextType) {
    let currentPos = pinnedContexts.findIndex((context) => context.id === props.currentContext.id)
    if (-1 === currentPos) {
      pinnedContexts.unshift(props.currentContext)
    }
  }

  const currentOrganization = useSelector(selectors.currentOrganization)

  return (
    <nav className="app-contexts app-toolbar">
      <Button
        type={CALLBACK_BUTTON}
        className="app-context-jump app-context-btn focus-ring"
        icon="fa fa-fw fa-angles-right"
        label={trans('go_to_content', {}, 'actions')}
        tooltip="right"
        callback={() => document.querySelector('#toggle-menu').focus()}
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
          <Button
            type={MODAL_BUTTON}
            className="app-context-btn focus-ring"
            icon="far fa-fw fa-compass"
            label={trans('search_and_history')}
            tooltip="right"
            modal={[MODAL_CONTEXT_SEARCH]}
          />
        </li>
      </ul>

      <hr className="app-context-separator mx-auto" aria-hidden={true} />

      {0 !== pinnedContexts.length &&
        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
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
      }

      <hr className="app-context-separator mt-auto mx-auto" aria-hidden={true} />
      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
        <li>
          <NotificationButton
            className="app-context-btn focus-ring"
            tooltip="right"
          />
        </li>

        <li>
          <ContextUser size="sm" className="app-context-btn" />
        </li>
      </ul>
    </nav>
  )
}

ContextNav.propTypes = {
  currentUser: T.shape({}),
  currentContext: T.shape({
    id: T.string
  }),
  currentContextType: T.string,

  availableContexts: T.arrayOf(T.shape({

  })),
  favoriteContexts: T.arrayOf(T.shape({

  }))
}

export {
  ContextNav
}
