import React, {forwardRef} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Button, Toolbar} from '#/main/app/action'
import {CALLBACK_BUTTON, CallbackButton, LINK_BUTTON, MENU_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {DataMicro} from '#/main/app/data/components/micro'
import {Menu} from '#/main/app/overlays/menu'

import {actions as platformActions, selectors as platformSelectors} from '#/main/app/platform/store'
import {MODAL_PLATFORM_ORGANIZATIONS} from '#/main/app/platform/modals/organizations'
import {getActions} from '#/main/app/context/utils'
import {route} from '#/main/app/context/routing'
import {selectors as contextSelectors} from '#/main/app/context/store'

const ContextFlyout = forwardRef((props, ref) => {
  // get context tools
  let toolLinks = []
  if (!props.notFound && !props.hasErrors) {
    toolLinks = props.tools
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
  }

  // get context actions
  let actions
  if (!isEmpty(props.contextData)) {
    actions = getActions(props.contextType, [props.contextData], {
      update: props.reload,
      delete() {
        props.history.push(route(props.contextType))
      }
    }, props.path, props.currentUser)
  }

  // get context organizations
  const organizations = useSelector(contextSelectors.organizations)

  const dispatch = useDispatch()

  return (
    <div {...props} className={classes('app-context-menu p-0 rounded-4', props.className)} ref={ref}>
      <div className="flyout-menu-content rounded-bottom-4" role="presentation">
        <div className="d-flex gap-3 px-4 pt-4 my-n1 align-items-center" role="presentation">
          <FavouriteButton />

          {actions &&
            <Toolbar
              id="app-menu-actions"
              className="ms-auto me-n1"
              buttonName="btn btn-text-body focus-ring p-1"
              actions={actions.then(actions => actions.filter((action) => 'configure' === action.name))}
              tooltip="bottom"
            />
          }
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
  title: T.node.isRequired,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired,
    permissions: T.object
  })),

  // from store
  contextData: T.object,
  contextType: T.string,
  notFound: T.bool.isRequired,
  hasErrors: T.bool.isRequired,
  reload: T.func.isRequired
}

ContextFlyout.defaultProps = {
  path: '',
  actions: []
}

const FavouriteButton = () => {
  const dispatch = useDispatch()

  const contextType = useSelector(contextSelectors.type)
  if ('workspace' !== contextType) {
    return null;
  }

  const contextData = useSelector(contextSelectors.data)
  const favourite = useSelector((state) => platformSelectors.isContextFavorite(state, contextData))

  return (
    <Button
      id="toggle-favorite"
      className="btn btn-text-body p-1 focus-ring ms-n1"
      type={CALLBACK_BUTTON}
      label={trans(favourite ? 'remove-favourite' : 'add-favourite', {}, 'actions')}
      icon={classes('fa fs-base', {
        'fa-star text-warning': favourite,
        'far fa-star': !favourite
      })}
      callback={() => dispatch(platformActions.saveFavorite(contextData))}
      size="sm"
    />
  )
}

const ContextMenu = (props) => {
  const contextPath = useSelector(contextSelectors.path)
  const contextData = useSelector(contextSelectors.data)
  const contextType = useSelector(contextSelectors.type)
  const tools = useSelector(contextSelectors.visibleTools)

  return (
    <Button
      id="toggle-menu"
      type={MENU_BUTTON}
      className="context-menu-btn d-flex flex-row align-items-center gap-3 py-2 px-3 mx-n3"
      menu={
        <Menu
          as={ContextFlyout}
          className="flyout-menu"
          {...props}
          tools={tools}
          path={contextPath}
          contextData={contextData}
          contextType={contextType}
        />
      }
    >
      <span className="fa fa-bars" aria-hidden={true} />

      <div className="text-start text-truncate mb-0 fs-sm" role="presentation">
        {contextData.name}

        {props.name &&
          <>
            <span className="mx-1" role="presentation"> / </span>
            <span className="text-body-secondary">
              {props.name}
            </span>
          </>
        }
      </div>
    </Button>
  )
}

export {
  ContextMenu
}
