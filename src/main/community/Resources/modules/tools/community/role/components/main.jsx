import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {RoleList} from '#/main/community/tools/community/role/containers/list'
import {RoleShow} from '#/main/community/tools/community/role/containers/show'

const RoleMain = props =>
  <Routes
    path={`${props.path}/roles`}
    routes={[
      {
        path: '',
        exact: true,
        component: RoleList
      }, {
        path: '/:id',
        component: RoleShow,
        onEnter: (params) => props.open(params.id, props.contextData)
      }
    ]}
  />

RoleMain.propTypes = {
  path: T.string.isRequired,
  contextData: T.object,
  open: T.func.isRequired
}

export {
  RoleMain
}
