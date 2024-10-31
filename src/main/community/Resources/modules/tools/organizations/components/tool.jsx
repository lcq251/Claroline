import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Tool} from '#/main/core/tool'

import {OrganizationList} from '#/main/community/tools/organizations/containers/list'
import {OrganizationCreate} from '#/main/community/tools/organizations/containers/create'
import {OrganizationEdit} from '#/main/community/tools/organizations/containers/edit'
import {OrganizationShow} from '#/main/community/tools/organizations/containers/show'

const OrganizationsTool = (props) =>
  <Tool
    {...props}
    pages={[
      {
        path: '',
        component: OrganizationList,
        exact: true
      }, {
        path: '/new',
        component: OrganizationCreate,
        onEnter: props.new
      }, {
        path: '/:id/edit',
        component: OrganizationEdit,
        onEnter: (params) => props.open(params.id)
      }, {
        path: '/:id',
        component: OrganizationShow,
        onEnter: (params) => props.open(params.id)
      }
    ]}
  />

OrganizationsTool.propTypes = {
  open: T.func.isRequired
}

export {
  OrganizationsTool
}
