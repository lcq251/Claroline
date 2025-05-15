import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {Course} from '#/plugin/cursus/course/containers/main'
import {CourseEditor} from '#/plugin/cursus/course/editor/containers/main'
import {CatalogList} from '#/plugin/cursus/tools/trainings/catalog/components/list'

const CatalogMain = (props) =>
  <Routes
    path={props.path+'/course'}
    routes={[
      {
        path: '/',
        exact: true,
        render: () => (
          <CatalogList
            path={props.path}
            canEdit={props.canEdit}
            contextType={props.contextType}
            openForm={props.openForm}
          />
        )
      }, {
        path: '/new',
        disabled: !props.canEdit,
        render: () => (<CourseEditor isNew={true}/>)
      }, {
        path: '/:slug/edit',
        render: (params = {}) => (
          <CourseEditor
            path={props.path}
            slug={params.match.params.slug}
          />
        )
      }, {
        path: '/:slug',
        onEnter: (params = {}) => props.open(params.slug),
        render: (params = {}) => (
          <Course
            history={params.history}
          />
        )
      }
    ]}
  />

CatalogMain.propTypes = {
  path: T.string.isRequired,
  canEdit: T.bool.isRequired,
  open: T.func.isRequired
}

export {
  CatalogMain
}
