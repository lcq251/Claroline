import React, {forwardRef, useCallback} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, CallbackButton, LINK_BUTTON, MENU_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {DataMicro} from '#/main/app/data/components/micro'
import {Menu} from '#/main/app/overlays/menu'

import {actions as platformActions} from '#/main/app/platform/store'
import {MODAL_PLATFORM_ORGANIZATIONS} from '#/main/app/platform/modals/organizations'

import {ContextFavourite} from '#/main/app/context/components/favorite'
import {actions, selectors} from '#/main/app/context/store'

const ContextFlyout = forwardRef((props, ref) => {
  const dispatch = useDispatch()

  const notFound = useSelector(selectors.notFound)
  const hasErrors = useSelector(selectors.hasErrors)

  const tools = useSelector(selectors.visibleTools)
  // get context organizations
  const organizations = useSelector(selectors.organizations)

  const togglePin = useCallback(() => {
    dispatch(actions.toggleMenuPin())
  }, [props.path])
  const toggleMenu = useCallback(() => {
    dispatch(actions.toggleMenuOpen())
  }, [props.path])

  // get context tools
  let toolLinks = []
  if (!notFound && !hasErrors) {
    toolLinks = tools
      .map(tool => ({
        name: tool.name,
        type: LINK_BUTTON,
        icon: `fa fa-fw fa-${tool.icon}`,
        label: trans(tool.name, {}, 'tools'),
        target: props.path + '/' + tool.name,
        status: tool.status,
        subscript: tool.status ? {
          type: 'label',
          value: tool.status,
          status: 'primary'
        } : undefined
      }))

    if (hasPermission('administrate', props.contextData)) {
      // append editor
      toolLinks.push({
        name: 'parameters',
        type: LINK_BUTTON,
        icon: `fa fa-fw fa-sliders`,
        label: trans('parameters'),
        target: props.path + '/edit'
      })
    }
  }

  return (
    <div {...props} className={classes('app-context-menu p-0 rounded-4', props.className)} ref={ref}>
      <div className="flyout-menu-content rounded-bottom-4" role="presentation">
        <div className="d-flex gap-3 px-4 pt-4 my-n1 align-items-center" role="presentation">
          <Button
            id="toggle-menu"
            type={CALLBACK_BUTTON}
            className="btn btn-text-body p-1 focus-ring"
            label={trans('pin-menu', {}, 'actions')}
            tooltip="bottom"
            callback={togglePin}
            size="sm"
          >
            <span className="fa fa-thumb-tack fs-base" aria-hidden={true} />
          </Button>

          <ContextFavourite />
        </div>

        {1 < toolLinks.length &&
          <ul className={classes('flyout-menu-items list-unstyled p-4 mb-0', {
            'flyout-menu-items-2': 6 >= toolLinks.length,
            'flyout-menu-items-4': 6 < toolLinks.length
          })}>
            {toolLinks.map(toolLink =>
              <li key={toolLink.name}>
                <Button
                  {...omit(toolLink, 'label')}
                  className="flyout-menu-item focus-ring"
                  onClick={toggleMenu}
                >
                  <span className="text-truncate w-100 text-center" role="presentation">{toolLink.label}</span>
                </Button>
              </li>
            )}
          </ul>
        }

        {1 < organizations.length &&
          <div className="bg-body-tertiary p-4 rounded-bottom-4" role="presentation">
            <h4 className="fs-sm text-body-secondary text-uppercase d-flex align-items-center gap-3">
              {trans('organizations', {}, 'community')}

              {3 < organizations.length &&
                <Button
                  className="btn btn-link ms-auto"
                  type={MODAL_BUTTON}
                  label={trans('see_all', {}, 'actions')}
                  modal={[MODAL_PLATFORM_ORGANIZATIONS, {
                    organizations: organizations
                  }]}
                  size="sm"
                  onClick={toggleMenu}
                >
                  <span className="fa fa-arrow-right ms-2" aria-hidden={true} />
                </Button>
              }
            </h4>

            <ul className="list-unstyled d-flex flex-column gap-2 m-n1 mb-0">
              {organizations.slice(0, 3).map(organization => (
                <li key={organization.id}>
                  <CallbackButton
                    className="fw-bolder btn btn-link text-reset p-1 w-100 fs-sm"
                    callback={() => dispatch(platformActions.changeOrganization(organization))}
                    onClick={toggleMenu}
                  >
                    <DataMicro object={organization} />
                  </CallbackButton>
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    </div>
  )
})

ContextFlyout.propTypes = {
  path: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired,
    permissions: T.object
  })),

  // from store
  contextData: T.object,
  contextType: T.string,
  notFound: T.bool.isRequired,
  hasErrors: T.bool.isRequired
}

const ContextMenu = (props) => {
  const dispatch = useDispatch()

  const contextPath = useSelector(selectors.path)
  const contextData = useSelector(selectors.data)
  const contextType = useSelector(selectors.type)

  const menuOpened = useSelector(selectors.menuOpened)
  const menuPined = useSelector(selectors.menuPined)
  const toggleMenu = useCallback(() => {
    dispatch(actions.toggleMenuOpen())
  }, [contextPath])

  return (
    <div className="d-flex flex-row align-items-center gap-3" role="presentation">
      {!menuPined &&
        <Button
          id="toggle-menu"
          type={MENU_BUTTON}
          className="btn btn-text-body focus-ring py-1 px-2 ms-n2"
          icon="fa fa-bars"
          label={trans(menuOpened ? 'hide-menu': 'show-menu', {}, 'actions')}
          tooltip="bottom"
          onToggle={toggleMenu}
          menu={
            <Menu
              show={menuOpened}
              as={ContextFlyout}
              className="flyout-menu"
              {...props}
              path={contextPath}
              contextData={contextData}
              contextType={contextType}
            />
          }
        />
      }

      <div className="text-start text-truncate mb-0 fs-sm" role="presentation">
        {contextData.name || trans(contextType, {}, 'context')}

        {props.name &&
          <>
            <span className="mx-1" role="presentation"> / </span>
            <span className="text-body-secondary">
              {props.name}
            </span>
          </>
        }
      </div>
    </div>
  )
}

export {
  ContextMenu
}
