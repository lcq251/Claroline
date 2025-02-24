import React, {useCallback, useId} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, CallbackButton, MODAL_BUTTON} from '#/main/app/buttons'
import {DataMicro} from '#/main/app/data/components/micro'

import {actions as platformActions} from '#/main/app/platform/store'
import {MODAL_PLATFORM_ORGANIZATIONS} from '#/main/app/platform/modals/organizations'
import {selectors} from '#/main/app/context/store'
import {ContextFavourite} from '#/main/app/context/components/favorite'
import {useLocaleStorage} from '#/main/app/storage'

const ContextMenu = (props) => {
  const dispatch = useDispatch()

  const notFound = useSelector(selectors.notFound)
  const hasErrors = useSelector(selectors.hasErrors)

  const contextPath = useSelector(selectors.path)
  const toolLinks = useSelector(selectors.toolLinks)
  // get context organizations
  const organizations = useSelector(selectors.organizations)

  const [pinedMenu, setPinedMenu] = useLocaleStorage('contextMenuPined', false)
  const toggleMenu = useCallback(() => {
    setPinedMenu(!pinedMenu)
    document.querySelector('.app-context-menu-toggle').focus()
  }, [contextPath])

  const toolsTitleId = useId()
  const organizationsTitleId = useId()

  if (notFound || hasErrors) {
    return null
  }

  return (
    <div className={classes('app-context-menu app-menu d-flex flex-column flex-shrink-0 border-end', props.className)} style={{width: '16rem'}}>
      <h2 className="visually-hidden">{trans('context_menu')}</h2>
      <div className="d-flex flex-row align-items-center">
        <Button
          id="toggle-menu"
          type={CALLBACK_BUTTON}
          className="app-context-menu-toggle btn btn-text-body my-1 ms-2 focus-ring"
          icon="fa fa-angles-left"
          label={trans('unpin-menu', {}, 'actions')}
          tooltip="bottom"
          callback={toggleMenu}
        />
        <ContextFavourite className="text-start" />
      </div>

      {1 < toolLinks.length &&
        <nav aria-labelledby={toolsTitleId} className="d-flex flex-column flex-fill">
          <h3 id={toolsTitleId} className="visually-hidden">{trans('tools')}</h3>
          <ul className={classes('app-menu-items list-unstyled flex-fill px-0 mb-3', {
          })}>
            {toolLinks.map(toolLink =>
              <li key={toolLink.name} className={classes('parameters' === toolLink.name && 'mt-auto')}>
                <Button
                  {...omit(toolLink, 'label')}
                  className="app-menu-item focus-ring"
                >
                  <span className="text-truncate w-100" role="presentation">{toolLink.label}</span>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      }

      {1 < organizations.length &&
        <nav className="bg-body-tertiary p-4 d-flex flex-column mt-auto" aria-labelledby={organizationsTitleId}>
          <h3 id={organizationsTitleId} className="fs-sm text-body-secondary text-uppercase">
            {trans('organizations', {}, 'community')}
          </h3>

          <ul className="list-unstyled d-flex flex-column gap-2 m-n1 mb-0">
            {organizations.slice(0, 3).map(organization => (
              <li key={organization.id}>
                <CallbackButton
                  className="fw-bolder btn btn-link text-reset p-1 w-100 fs-sm"
                  callback={() => dispatch(platformActions.changeOrganization(organization))}
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
            >
              <span className="fa fa-arrow-right ms-2" aria-hidden={true} />
            </Button>
          }
        </nav>
      }
    </div>
  )
}

ContextMenu.propTypes = {
  className: T.string
}

export {
  ContextMenu
}
