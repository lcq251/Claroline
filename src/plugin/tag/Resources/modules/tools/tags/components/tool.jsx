import React from 'react'

import {Tool} from '#/main/core/tool'

import {TagList} from '#/plugin/tag/tools/tags/components/list'
import {TagShow} from '#/plugin/tag/tools/tags/components/show'

const TagsTool = (props) =>
  <Tool
    {...props}
    pages={[
      {
        path: '/',
        exact: true,
        component: TagList
      }, {
        path: '/:id',
        render: (routerProps) => <TagShow id={routerProps.match.params.id} />
      }
    ]}
  />

export {
  TagsTool
}
