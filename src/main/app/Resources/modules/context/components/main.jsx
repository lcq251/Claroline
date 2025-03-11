import React, {createElement, useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {makeCancelable} from '#/main/app/api'
import {Routes} from '#/main/app/router'
import {trans} from '#/main/app/intl'
import {ContentNotFound} from '#/main/app/content/components/not-found'
import {ContentLoader} from '#/main/app/content/components/loader'
import {ContentForbidden} from '#/main/app/content/components/forbidden'
import {ContextEditor} from '#/main/app/context/editor/containers/main'
import {ContextProfile} from '#/main/app/context/profile/containers/main'
import {getTool} from '#/main/core/tool/utils'
import {hasPermission} from '#/main/app/security'
import {useCtrlKeyPress} from '#/main/app/dom/key'
import {actions as modalActions} from '#/main/app/overlays/modal'
import {MODAL_COMMAND_PALETTE} from '#/main/app/context/modals/command-palette'
import {ContextSidebar} from '#/main/app/context/components/sidebar'
import {useLocaleStorage} from '#/main/app/storage'

const ContextMain = (props) => {
  const dispatch = useDispatch()

  const [pinedMenu] = useLocaleStorage('contextMenuPined', false)
  const [toolApps, setToolApps] = useState({loaded: false, tools: []})

  useCtrlKeyPress('k', (event) => {
    dispatch(modalActions.showModal(MODAL_COMMAND_PALETTE))

    event.preventDefault()
    event.stopPropagation()
  })

  // change current context
  useEffect(() => {
    if (props.name) {
      props.open(props.name, props.id)
    }
  }, [props.name, props.id])

  // fetch current context data
  useEffect(() => {
    let openQuery
    if (props.name && !props.loaded) {
      openQuery = makeCancelable(
        props.fetch(props.name, props.id)
      )

      openQuery.promise
        .then((response) => {
          if (props.onOpen) {
            props.onOpen(response.data)
          }
        })
        .then(
          () => openQuery = null,
          () => openQuery = null
        )
    }

    return () => {
      if (openQuery && props.loaded) {
        openQuery.cancel()
      }
    }
  }, [props.loaded])

  // fetch tool apps
  useEffect(() => {
    let appPromise
    if (props.loaded) {
      // load apps for every tool defined in this context
      appPromise = makeCancelable(Promise.all(
        props.tools.map(tool => getTool(tool.name, props.name)
          .then(toolApp => ({
            name: tool.name,
            app: toolApp.default.component
          }))
          .catch(e => console.error(e))
        )
      ))

      appPromise.promise
        .then(loadedApps => {
          setToolApps({
            loaded: true,
            tools: loadedApps.reduce((acc, current) => Object.assign(acc, {
              [current.name]: current.app
            }), {})
          })
        })
        .then(
          () => appPromise = null,
          () => appPromise = null
        )
    } else {
      setToolApps({loaded: false, tools: []})
    }

    return () => {
      if (appPromise) {
        appPromise.cancel()
      }
    }
  }, [props.loaded, props.tools.map(t => t.name).join('-')])

  if (props.loaded && toolApps.loaded) {
    if (!isEmpty(props.accessErrors)) {
      return props.forbiddenPage ?
        createElement(props.forbiddenPage) :
        <ContentForbidden
          size="lg"
          title={trans('access_forbidden')}
          description={trans('access_forbidden_help')}
        />
    }

    if (props.notFound) {
      return props.notFoundPage ?
        createElement(props.notFoundPage) :
        <ContentNotFound
          size="lg"
          title={trans('not_found')}
          description={trans('not_found_desc')}
        />
    }

    return (
      <>
        {pinedMenu &&
          <ContextSidebar />
        }

        <Routes
          path={props.path}
          routes={[
            {
              path: '/profile',
              component: ContextProfile
            }, {
              path: '/edit',
              component: props.editor || ContextEditor
            }, {
              path: '/:toolName',
              onEnter: (params = {}) => {
                const openedTool = props.tools.find(tool => tool.name === params.toolName)
                if (isEmpty(openedTool) || !hasPermission('open', openedTool)) {
                  // tool is disabled (or does not exist) for the context
                  // let's go to the default opening of the context
                  props.history.replace(props.path)
                }
              },
              render: (routerProps) => {
                const params = routerProps.match.params

                return createElement(toolApps.tools[params.toolName], {
                  name: params.toolName,
                  path: props.path+'/'+params.toolName
                })
              }
            }
          ]}
          redirect={[
            {from: '/', exact: true, to: `/${props.defaultOpening}`, disabled: !props.defaultOpening}
          ]}
        />

        {props.children}
      </>
    )
  }

  return props.loadingPage ?
    createElement(props.loadingPage) :
    <ContentLoader
      size="lg"
      description={trans('loading')}
    />
}

ContextMain.propTypes = {
  // context info
  path: T.string.isRequired,
  id: T.string,
  name: T.string.isRequired,

  // context status
  loaded: T.bool.isRequired,
  notFound: T.bool.isRequired,
  accessErrors: T.object,
  // context params
  defaultOpening: T.string,
  tools: T.arrayOf(T.shape({
    name: T.string.isRequired,
    permissions: T.shape({
      open: T.bool
    })
  })),

  // custom context components
  loadingPage: T.elementType,
  notFoundPage: T.elementType,
  forbiddenPage: T.elementType,
  editor: T.elementType,
  onOpen: T.func,

  open: T.func.isRequired,
  history: T.shape({
    replace: T.func.isRequired
  }).isRequired,
  children: T.node
}

export {
  ContextMain
}
