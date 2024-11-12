import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Tool} from '#/main/core/tool'

import {TemplateList} from '#/main/template/administration/templates/containers/list'
import {TemplateDetails} from '#/main/template/administration/templates/containers/details'

const TemplateTool = (props) =>
  <Tool
    {...props}
    redirect={[
      {from: '/', exact: true, to: '/email'}
    ]}
    menu={[
      {
        name: 'email',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-at',
        label: trans('email'),
        target: `${props.path}/email`
      }, {
        name: 'pdf',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-file-pdf',
        label: trans('pdf'),
        target: `${props.path}/pdf`
      }, {
        name: 'other',
        type: LINK_BUTTON,
        label: trans('other'),
        target: `${props.path}/other`
      }
    ]}
    pages={[
      {
        path: '/:type',
        exact: true,
        onEnter: () => props.invalidateList(),
        render: (routerProps) => (
          <TemplateList
            type={routerProps.match.params.type}
          />
        )
      }, {
        path: '/:type/:templateType',
        onEnter: (params) => props.open(params.templateType || null),
        component: TemplateDetails
      }
    ]}
  />

TemplateTool.propTypes = {
  path: T.string.isRequired,
  open: T.func.isRequired,
  invalidateList: T.func.isRequired
}

export {
  TemplateTool
}
