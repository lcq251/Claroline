import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'

import {OrganizationForm} from '#/main/community/organization/components/form'
import {selectors} from '#/main/community/tools/organizations/store'
import {PageContent} from '#/main/app/page'

const OrganizationCreate = (props) =>
  <ToolPage
    title={trans('new_organization', {}, 'community')}
  >
    <PageContent>
      <OrganizationForm
        className="mt-3"
        path={props.path}
        name={selectors.FORM_NAME}
      />
    </PageContent>
  </ToolPage>

OrganizationCreate.propTypes = {
  path: T.string
}

export {
  OrganizationCreate
}
