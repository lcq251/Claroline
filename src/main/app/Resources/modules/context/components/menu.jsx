import React, {forwardRef, useCallback, useId} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {useLocaleStorage} from '#/main/app/storage'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, CallbackButton, MENU_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {DataMicro} from '#/main/app/data/components/micro'
import {Menu} from '#/main/app/overlays/menu'

import {actions as platformActions} from '#/main/app/platform/store'
import {MODAL_PLATFORM_ORGANIZATIONS} from '#/main/app/platform/modals/organizations'

import {ContextFavourite} from '#/main/app/context/components/favorite'
import {actions, selectors} from '#/main/app/context/store'

const ContextFlyout = forwardRef((props, ref) => {
  const dispatch = useDispatch()

  // get context organizations
  const organizations = useSelector(selectors.organizations)
  // get context tools
  const toolLinks = useSelector(selectors.toolLinks)

  const toolsTitleId = useId()
  const organizationsTitleId = useId()

  return (
    <div
      {...omit(props, 'togglePin', 'show', 'close')}
      className={classes('app-context-menu p-0 rounded-4', props.className)}
      ref={ref}
    >
      <h2 className="visually-hidden">{trans('context_menu')}</h2>
      <div className="flyout-menu-content rounded-bottom-4" role="presentation">
        <div className="d-flex gap-3 px-4 pt-4 my-n1 align-items-center" role="presentation">
          <Button
            id="toggle-menu"
            type={CALLBACK_BUTTON}
            className="btn btn-text-body p-1 focus-ring"
            label={trans('pin-menu', {}, 'actions')}
            tooltip="bottom"
            callback={props.togglePin}
            size="sm"
          >
            <span className="fa fa-thumb-tack fs-base" aria-hidden={true} />
          </Button>

          <ContextFavourite />
        </div>

        {1 < toolLinks.length &&
          <nav aria-labelledby={toolsTitleId}>
            <h3 id={toolsTitleId} className="visually-hidden">{trans('tools')}</h3>
            <ul className={classes('flyout-menu-items list-unstyled p-4 mb-0', {
              'flyout-menu-items-2': 6 >= toolLinks.length,
              'flyout-menu-items-4': 6 < toolLinks.length
            })}>
              {toolLinks.map(toolLink =>
                <li key={toolLink.name}>
                  <Button
                    {...omit(toolLink, 'label')}
                    className="flyout-menu-item focus-ring"
                    onClick={props.closeMenu}
                  >
                    <span className="text-truncate w-100 text-center" role="presentation">{toolLink.label}</span>
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        }

        {1 < organizations.length &&
          <nav className="bg-body-tertiary p-4 d-flex flex-column rounded-bottom-4" aria-labelledby={organizationsTitleId}>
            <h3 id={organizationsTitleId} className="fs-sm text-body-secondary text-uppercase">
              {trans('organizations', {}, 'community')}
            </h3>

            <ul className="list-unstyled d-flex flex-column gap-2 m-n1 mb-0">
              {organizations.slice(0, 3).map(organization => (
                <li key={organization.id}>
                  <CallbackButton
                    className="fw-bolder btn btn-link text-reset p-1 w-100 fs-sm"
                    callback={() => dispatch(platformActions.changeOrganization(organization))}
                    onClick={props.closeMenu}
                  >
                    <DataMicro object={organization} />
                  </CallbackButton>
                </li>
              ))}
            </ul>

            {3 < organizations.length &&
              <Button
                className="btn btn-link ms-auto mt-3 mb-n1 me-n2"
                type={MODAL_BUTTON}
                label={trans('see_all', {}, 'actions')}
                modal={[MODAL_PLATFORM_ORGANIZATIONS, {
                  organizations: organizations
                }]}
                size="sm"
                onClick={props.closeMenu}
              >
                <span className="fa fa-arrow-right ms-2" aria-hidden={true} />
              </Button>
            }
          </nav>
        }
      </div>
    </div>
  )
})

ContextFlyout.propTypes = {
  path: T.string,
  contextData: T.object,
  contextType: T.string,
  togglePin: T.func.isRequired,
  closeMenu: T.func.isRequired
}

const ContextMenu = (props) => {
  const dispatch = useDispatch()

  const contextPath = useSelector(selectors.path)
  const contextData = useSelector(selectors.data)
  const contextType = useSelector(selectors.type)
  const notFound = useSelector(selectors.notFound)
  const hasErrors = useSelector(selectors.hasErrors)

  const menuOpened = useSelector(selectors.menuOpened)
  const toggleMenu = useCallback(() => {
    dispatch(actions.toggleMenuOpen())
  }, [contextPath])

  const [pinedMenu, setPinedMenu] = useLocaleStorage('contextMenuPined', false)

  return (
    <div className="d-flex flex-row align-items-center gap-3" role="presentation">
      {!pinedMenu &&
        <Button
          id="toggle-menu"
          type={MENU_BUTTON}
          className="app-context-menu-toggle btn btn-text-body focus-ring py-1 px-2 ms-n2"
          icon="fa fa-bars"
          label={trans(menuOpened ? 'hide-menu': 'show-menu', {}, 'actions')}
          tooltip="bottom"
          onToggle={toggleMenu}
          disabled={notFound || hasErrors}
          menu={
            <Menu
              show={menuOpened}
              as={ContextFlyout}
              className="flyout-menu"
              togglePin={() => {
                setPinedMenu(!pinedMenu)
                toggleMenu()
                document.querySelector('.app-context-menu-toggle').focus()
              }}
              closeMenu={toggleMenu}
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
