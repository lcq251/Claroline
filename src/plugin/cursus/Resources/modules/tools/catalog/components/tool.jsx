import React from 'react'

import {Tool} from '#/main/core/tool'
import {Course} from '#/plugin/cursus/course/containers/main'
import {CatalogList} from '#/plugin/cursus/tools/catalog/components/list'

const CatalogTool = (props) =>
  <Tool
    {...props}
    pages={[
      {
        path: '/',
        exact: true,
        render: () => (
          <CatalogList path={props.path} canEdit={props.canEdit} />
        )
      }, {
        path: '/course/:slug',
        onEnter: (params = {}) => props.open(params.slug),
        render: (params = {}) => (
          <Course
            history={params.history}
          />
        )
      }
    ]}
  />

export {
  CatalogTool
}
