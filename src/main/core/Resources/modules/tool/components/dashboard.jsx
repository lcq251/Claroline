import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Dashboard} from '#/main/app/dashboard'

import {ToolPage} from '#/main/core/tool/components/page'
import {selectors} from '#/main/core/tool/store'

const ToolDashboard = (props) => {
  const toolPath = useSelector(selectors.path)

  return (
    <ToolPage title={trans('dashboard')}>
      <Dashboard
        path={toolPath+'/dashboard'}
        pages={props.pages}
        actionsPage={props.actionsPage}
      />
    </ToolPage>
  )
}

ToolDashboard.propTypes = {
  pages: T.arrayOf(T.shape({
    name: T.string.isRequired,
    icon: T.string.isRequired,
    title: T.string.isRequired,
    component: T.elementType,
    render: T.func,
    disabled: T.bool
  })),

  // standard pages
  actionsPage: T.elementType
}

export {
  ToolDashboard
}
