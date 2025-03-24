import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {getActions} from '#/main/community/role/utils'
import {Role as RoleTypes} from '#/main/community/role/prop-types'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {PageContent} from '#/main/app/page'

const Role = (props) =>
  <ToolPage
    title={trans('role_name', {name: trans(get(props.role, 'translationKey', 'loading'))}, 'community')}
    description={get(props.role, 'meta.description')}
  >
    {isEmpty(props.role) &&
      <PageContent className="placeholder-glow">
        <PageHeadingSkeleton
          size="md"
          description={true}
        />
      </PageContent>
    }

    {!isEmpty(props.role) &&
      <PageContent>
        <PageHeading
          size="md"
          title={trans(get(props.role, 'translationKey', 'loading'))}
          description={get(props.role, 'meta.description')}
          primaryAction="edit"
          actions={!isEmpty(props.role) ? getActions([props.role], {
            add: () => props.reload(props.role.id),
            update: () => props.reload(props.role.id),
            delete: () => props.reload(props.role.id)
          }, props.path, props.currentUser) : []}
        />

        {props.children}
      </PageContent>
    }
  </ToolPage>

Role.propTypes = {
  path: T.string,
  role: T.shape(
    RoleTypes.propTypes
  ),
  currentUser: T.object,
  children: T.any,
  reload: T.func
}

const RolePage = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state)
  })
)(Role)

export {
  RolePage
}
