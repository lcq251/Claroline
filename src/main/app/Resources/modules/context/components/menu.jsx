import React, {cloneElement, createElement, forwardRef, useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Button, Toolbar} from '#/main/app/action'
import {CALLBACK_BUTTON, CallbackButton, LINK_BUTTON, MENU_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {getActions} from '#/main/app/context/utils'
import {route} from '#/main/app/context/routing'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {useDispatch, useSelector} from 'react-redux'
import {selectors as contextSelectors} from '#/main/app/context/store'
import {actions as platformActions, selectors as platformSelectors} from '#/main/app/platform/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {Menu} from '#/main/app/overlays/menu'
import {DataMicro} from '#/main/app/data/components/micro'
import {MODAL_PLATFORM_ORGANIZATIONS} from '#/main/app/platform/modals/organizations'
import {getTool} from '#/main/core/tool/utils'

const ToolPreview = (props) => {
  const [previewComponent, setToolPreview] = useState(null)

  useEffect(() => {
    getTool(props.name, props.contextName).then((toolApp => {
      setToolPreview(toolApp.default.preview || null)
    }))
  }, [props.name, props.contextName])

  console.log(previewComponent)

  if (!previewComponent) {
    return null
  }

  return cloneElement(previewComponent)
}

ToolPreview.propTypes = {
  name: T.string.isRequired,
  contextName: T.string.isRequired
}

const ContextFlyout = forwardRef((props, ref) => {
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

  let actions
  if (!isEmpty(props.contextData)) {
    actions = getActions(props.contextType, [props.contextData], {
      update: props.reload,
      delete() {
        props.history.push(route(props.contextType))
      }
    }, props.path, props.currentUser)
  }

  const dispatch = useDispatch()
  const favourite = useSelector((state) => platformSelectors.isContextFavorite(state, props.contextData))

  const [selectedTool, setSelectedTool] = useState(props.toolName)

  return (
    <section {...props} className={classes('app-context-menu p-0 rounded-4', props.className)} ref={ref} >
      {false && (props.contextData && get(props.contextData, 'poster')) &&
        <Thumbnail
          className="rounded-top-4"
          thumbnail={get(props.contextData, 'poster')}
          name={get(props.contextData, 'name')}
        />
      }

      <div className="flyout-menu-content rounded-bottom-4">
        <div className="d-flex gap-3 px-4 pt-4 align-items-center">
          {'workspace' === props.contextType ?
            <Button
              id="toggle-favorite"
              type={CALLBACK_BUTTON}
              className={classes('btn', {
                'btn-body': favourite,
                'btn-primary': !favourite
              })}
              size="sm"
              icon={classes('fa', {
                'fa-star': !favourite,
                'far fa-star': favourite
              })}
              label={trans(favourite ? 'remove-favourite' : 'add-favourite', {}, 'actions')}
              callback={() => dispatch(platformActions.saveFavorite(props.contextData))}
            /> :
            <>
            </>
          }

          {actions &&
            <Toolbar
              id="app-menu-actions"
              className="ms-auto"
              buttonName="btn btn-text-body me-n3 focus-ring focus-ring-secondary"
              actions={actions.then(actions => actions.filter((action) => 'configure' === action.name))}
              tooltip="bottom"
            />
          }
        </div>

        {1 < toolLinks.length &&
          <div className="flyout-menu-cols">
            <div className="flyout-menu-col w-50">
              <ul className="app-menu-items list-unstyled my-4">
                {toolLinks.map(toolLink =>
                  <li key={toolLink.name}>
                    <Button
                      {...toolLink}
                      className="app-menu-item focus-ring"
                      onMouseOver={() => setSelectedTool(toolLink.name)}
                    />
                  </li>
                )}
              </ul>
            </div>

            <div className="flyout-menu-col my-4 px-4 border-start w-50">
              {selectedTool &&
                <ToolPreview
                  name={selectedTool}
                  contextName={props.contextType}
                />
              }
            </div>
          </div>
        }

        {!isEmpty(props.organizations) &&
          <div className="bg-body-tertiary p-4 rounded-bottom-4">
            <h4 className="fs-sm text-body-secondary text-uppercase d-flex align-items-center gap-3">
              {trans('organizations', {}, 'community')}

              {5 < props.organizations.length &&
                <Button
                  className="btn btn-link ms-auto"
                  type={MODAL_BUTTON}
                  label={trans('see_all', {}, 'actions')}
                  modal={[MODAL_PLATFORM_ORGANIZATIONS, {
                    organizations: props.organizations
                  }]}
                  size="sm"
                >
                  <span className="fa fa-arrow-right ms-2" aria-hidden={true} />
                </Button>
              }
            </h4>

            <ul className="list-unstyled d-flex flex-column gap-2 m-n1 mb-0">
              {props.organizations.slice(0, 5).map(organization => (
                <li key={organization.id}>
                  <CallbackButton
                    className="fw-bolder btn btn-link text-reset p-1 w-100 fs-sm"
                    callback={() => {
                      dispatch(platformActions.changeOrganization(organization))
                    }}
                  >
                    <DataMicro object={organization} />
                  </CallbackButton>
                </li>
              ))}
            </ul>

          </div>
        }
      </div>
    </section>
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
  organizations: T.arrayOf(T.object),
  children: T.node,

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
      type={CALLBACK_BUTTON}
      label={trans(favourite ? 'remove-favourite' : 'add-favourite', {}, 'actions')}
      icon={classes('fa', {
        'fa-star text-warning': favourite,
        'far fa-star': !favourite
      })}
      tooltip="bottom"
      callback={() => dispatch(platformActions.saveFavorite(contextData))}
    />
  )
}

const MenuButton = (props) => {
  const contextPath = useSelector(contextSelectors.path)
  const contextData = useSelector(contextSelectors.data)
  const contextType = useSelector(contextSelectors.type)
  const toolName = useSelector(toolSelectors.name)
  const tools = useSelector(contextSelectors.visibleTools)
  const contextOrganizations = useSelector(contextSelectors.organizations)

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
          toolName={toolName}
          organizations={1 < contextOrganizations.length ? contextOrganizations : []}
        />
      }
    >
      <Thumbnail
        size="sm"
        className="me-1"
        thumbnail={contextData.thumbnail}
        name={contextData.name}
        square={true}
      />
      <div className="text-start text-truncate" role="presentation">
        <b className="h6 d-block m-0 text-truncate">
          {contextData.name}
        </b>
        {toolName &&
          <small className="text-truncate">{trans(toolName, {}, 'tools')}</small>
        }
      </div>

      <span className="fa fa-chevron-down fs-sm" aria-hidden={true} />
    </Button>
  )
}

const ContextMenu = (props) => {
  return (
    <>
      <MenuButton  {...props} />
      {/*<FavouriteButton />*/}
    </>
  )
}

export {
  ContextMenu
}
