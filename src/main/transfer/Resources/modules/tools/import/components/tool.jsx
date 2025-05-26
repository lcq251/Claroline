import React from 'react'
import {PropTypes as T} from 'prop-types'

import {constants as toolConstants, Tool} from '#/main/core/tool'

import {ImportList} from '#/main/transfer/tools/import/containers/list'
import {ImportEditor} from '#/main/transfer/import/editor/containers/main'
import {ImportShow} from '#/main/transfer/tools/import/containers/show'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import get from 'lodash/get'
import {ImportOverview} from '#/main/transfer/tools/import/components/overview'

const ImportTool = (props) =>
  <Tool
    {...props}
    styles={['claroline-distribution-main-transfer-transfer-tool']}
    menu={[
      /*{
        name: 'overview',
        type: LINK_BUTTON,
        label: trans('about'),
        target: props.path,
        exact: true
      }, {
        name: 'all',
        type: LINK_BUTTON,
        label: trans('all_imports', {}, 'transfer'),
        target: props.path+'/all'
      }*/
    ]}
    pages={[
      {
        path: '/',
        exact: true,
        component: ImportOverview,
        disabled: true
      }, {
        path: '/',
        exact: true,
        component: ImportList
      }, {
        path: '/new',
        disabled: !props.canImport,
        render: () => (
          <ImportEditor
            isNew={true}
            path={props.path}
            contextData={props.contextData}
          />
        )
      }, {
        path: '/:id',
        onEnter: (params) => props.open(params.id),
        component: ImportShow
      }
    ]}
  />

ImportTool.propTypes = {
  contextData: T.object,
  open: T.func.isRequired,
  path: T.string.isRequired,
  canImport: T.bool.isRequired
}

export {
  ImportTool
}
