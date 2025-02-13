import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'

import {OrganizationList as BaseOrganizationList} from '#/main/community/organization/components/list'
import {selectors} from '#/main/community/tools/organizations/store'

const OrganizationList = (props) =>
  <ToolPage
    title={trans('organizations', {}, 'community')}
  >
    <PageListSection
      title={trans('organizations', {}, 'community')}
      addAction={{
        name: 'add',
        type: LINK_BUTTON,
        label: trans('add_organization', {}, 'actions'),
        target: `${props.path}/new`,
        displayed: props.canCreate
      }}
    >
      <BaseOrganizationList
        className="mb-5"
        flush={true}
        path={props.path}
        name={selectors.LIST_NAME}
        url={['apiv2_organization_list']}
      />
    </PageListSection>
  </ToolPage>

OrganizationList.propTypes = {
  path: T.string.isRequired,
  canCreate: T.bool.isRequired
}

export {
  OrganizationList
}
