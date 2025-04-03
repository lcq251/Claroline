import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {GroupList} from '#/main/community/tools/community/group/containers/list'
import {GroupShow} from '#/main/community/tools/community/group/containers/show'

const GroupMain = props =>
  <Routes
    path={`${props.path}/groups`}
    routes={[
      {
        path: '',
        component: GroupList,
        exact: true
      }, {
        path: '/:id',
        component: GroupShow,
        onEnter: (params) => props.open(params.id)
      }
    ]}
  />

GroupMain.propTypes = {
  path: T.string.isRequired,
  contextType: T.string.isRequired,
  open: T.func.isRequired
}

export {
  GroupMain
}
