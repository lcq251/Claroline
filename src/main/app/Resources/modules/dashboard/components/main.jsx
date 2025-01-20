import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {Routes} from '#/main/app/router'
import {Toolbar} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {PageContent} from '#/main/app/page'

const Dashboard = (props) => {
  return (
    <>
      <Toolbar
        className="app-dashboard-toolbar m-4 me-0"
        buttonName="btn btn-text-body fs-sm app-dashboard-btn focus-ring px-3 py-4"
        actions={props.pages.map(page => ({
          name: page.name,
          type: LINK_BUTTON,
          icon: page.icon,
          label: page.title,
          target: props.path + '/' + (page.path || page.name),
          displayed: !page.disabled
        }))}
      />
      <PageContent className="d-flex">
        <Routes
          path={props.path}
          redirect={!isEmpty(props.pages) ? [
            {from: '/', exact: true, to: '/' + props.pages[0].name}
          ] : undefined}
          routes={props.pages.map(page => ({
            path: page.path || '/' + page.name,
            ...omit(page, 'name', 'icon', 'title')
          }))}
        />
      </PageContent>
    </>
  )
}

Dashboard.propTypes = {
  path: T.string.isRequired,
  pages: T.arrayOf(T.shape({
    name: T.string.isRequired,
    icon: T.string.isRequired,
    title: T.string.isRequired,
    component: T.elementType,
    render: T.func,
    disabled: T.bool
  }))
}

export {
  Dashboard
}
