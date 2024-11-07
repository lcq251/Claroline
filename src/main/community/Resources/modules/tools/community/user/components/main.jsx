import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {UserList} from '#/main/community/tools/community/user/containers/list'
import {UserCreate} from '#/main/community/tools/community/user/containers/create'
import {UserShow} from '#/main/community/tools/community/user/containers/show'
import {UserEditor} from '#/main/community/user/editor/containers/main'

const UserMain = props =>
  <Routes
    path={`${props.path}/users`}
    routes={[
      {
        path: '/',
        component: UserList,
        exact: true
      }, {
        path: '/new',
        component: UserCreate,
        onEnter: props.new,
        disabled: 'desktop' !== props.contextType || !props.canRegister
      }, {
        path: '/:username/edit',
        render: (routerProps) => (
          <UserEditor username={routerProps.match.params.username} path={`${props.path}/users/${routerProps.match.params.username}/edit`}/>
        )
      }, {
        path: '/:username',
        component: UserShow,
        onEnter: (params) => props.open(params.username)
      }
    ]}
  />

UserMain.propTypes = {
  path: T.string.isRequired,
  contextType: T.string.isRequired,
  canRegister: T.bool.isRequired,

  open: T.func.isRequired,
  new: T.func.isRequired
}

export {
  UserMain
}
