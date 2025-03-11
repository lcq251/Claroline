import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'

import {RoleForm} from '#/main/community/role/components/form'
import {selectors} from '#/main/community/tools/community/role/store'
import {PageContent} from '#/main/app/page'

const RoleCreate = (props) =>
  <ToolPage
    title={trans('new_role', {}, 'community')}
  >
    <PageContent>
      <RoleForm
        className="mt-3"
        path={props.path}
        name={selectors.FORM_NAME}
      />
    </PageContent>
  </ToolPage>

RoleCreate.propTypes = {
  path: T.string
}

export {
  RoleCreate
}
