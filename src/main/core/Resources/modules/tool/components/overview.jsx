import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {selectors} from '#/main/core/tool/store'
import {ToolPage} from '#/main/core/tool/components/page'
import {PageContent} from '#/main/app/page'

const ToolOverview = props => {
  const tool = useSelector(selectors.toolData)

  return (
    <ToolPage>
      <PageContent poster={get(tool, 'poster')}>
        {props.children}
      </PageContent>
    </ToolPage>
  )
}

ToolOverview.propTypes = {
  children: T.node
}

export {
  ToolOverview
}
