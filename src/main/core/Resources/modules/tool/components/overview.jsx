import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {selectors} from '#/main/core/tool/store'
import {ToolPage} from '#/main/core/tool/components/page'

const ToolOverview = props => {
  const tool = useSelector(selectors.toolData)

  return (
    <ToolPage
      poster={get(tool, 'poster')}
    >
      {props.children}
    </ToolPage>
  )
}

ToolOverview.propTypes = {
  children: T.node
}

export {
  ToolOverview
}
