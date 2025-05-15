import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'

import {PageContext} from '#/main/app/page/context'
import {selectors} from '#/main/core/resource/store'
import {ResourceRestrictions} from '#/main/core/resource/containers/restrictions'
import {ResourceEditor} from '#/main/core/resource/editor/containers/main'
import {ResourceDashboard} from '#/main/core/resource/dashboard'

import {ResourceProgression} from '#/main/evaluation/resource/progression'

const Resource = props => {
  const [loaded, setLoaded] = useState(false)

  const embedded = useSelector(selectors.embedded)
  const resourcePath = useSelector(selectors.path)
  const accessErrors = useSelector(selectors.accessErrors)
  const canEdit = useSelector(selectors.canEdit)
  const canFollow = useSelector(selectors.canFollow)
  const hasEvaluation = useSelector(selectors.hasEvaluation)

  useEffect(() => {
    props.open(props.type, props.slug)
    setLoaded(true)
  }, [props.slug])

  return (
    <PageContext.Provider
      value={{
        embedded: embedded,
        menu: [
          {
            name: 'overview',
            type: LINK_BUTTON,
            label: trans('resource_overview', {}, 'resource'),
            target: resourcePath,
            displayed: !!props.overviewPage,
            exact: true
          }
        ].concat(props.menu || []),
        actions: props.actions,
        styles: props.styles
      }}
    >
      {loaded && !isEmpty(accessErrors) &&
        <ResourceRestrictions />
      }

      {loaded && isEmpty(accessErrors) &&
        <Routes
          path={resourcePath}
          routes={[
            {
              path: '/edit',
              component: props.editor || ResourceEditor,
              disabled: !canEdit
            }, {
              path: '/dashboard',
              component: props.dashboard || ResourceDashboard,
              disabled: !canFollow
            }, {
              path: '/progression',
              component: ResourceProgression,
              disabled: !hasEvaluation
            }
          ]
            .concat(props.pages || [])
            .concat([
              {
                path: '/',
                disabled: !props.overviewPage,
                component: props.overviewPage,
                exact: true
              }
            ])
          }
          redirect={props.redirect}
        />
      }

      {loaded && isEmpty(accessErrors) && props.children}
    </PageContext.Provider>
  )
}

Resource.propTypes = {
  /**
   * The type of the tool.
   */
  type: T.string.isRequired,
  slug: T.string.isRequired,
  styles: T.arrayOf(T.string),
  children: T.node,
  open: T.func.isRequired,
  /**
   * The resource overview component
   * NB. This SHOULD extend the base <ResourceOverview /> component.
   */
  overviewPage: T.elementType,
  /**
   * The resource editor component
   * NB. This SHOULD extend the base <ResourceEditor /> component.
   */
  editor: T.elementType,
  /**
   * The resource editor component
   * NB. This SHOULD extend the base <ResourceDashboard /> component.
   */
  dashboard: T.elementType
}


export {
  Resource
}
