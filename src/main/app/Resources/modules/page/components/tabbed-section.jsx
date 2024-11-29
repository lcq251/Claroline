import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'
import {Nav} from '#/main/app/components/nav'

import {PageSection} from '#/main/app/page/components/section'
import {Route as RouteTypes} from '#/main/app/router/prop-types'

/**
 * Creates a section with tabs.
 * ATTENTION : it uses the Router to define the opened tab. YOU CAN HAVE ONLY ONE IN A PAGE !
 */
const PageTabbedSection = (props) =>
  <PageSection {...omit(props, 'path', 'tabs')}>
    <Nav
      variant="underline"
      orientation="horizontal"
      items={props.tabs.map(tab => ({
        key: tab.path,
        name: tab.path,
        type: LINK_BUTTON,
        icon: tab.icon,
        label: tab.title,
        badge: tab.badge,
        target: `${props.path}${tab.path}`,
        displayed: tab.displayed,
        exact: tab.exact,
        autoScroll: false
      }))}
    />

    <Routes
      path={props.path}
      routes={props.tabs.map(tab => ({
        path: tab.path,
        render: tab.render,
        component: tab.component,
        disabled: tab.disabled || (undefined !== tab.displayed && !tab.displayed),
        exact: tab.exact,
        onEnter: tab.onEnter
      }))}
    />
  </PageSection>

PageTabbedSection.propTypes = {
  ...PageSection.propTypes,
  path: T.string,
  tabs: T.arrayOf(T.shape({
    ...RouteTypes.propTypes,
    icon: T.string,
    title: T.string,
    displayed: T.bool,
    badge: T.element
  }))
}

PageTabbedSection.defaultProps = {
  tabs: []
}

export {
  PageTabbedSection
}
