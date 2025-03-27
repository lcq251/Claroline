import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {getActions} from '#/main/community/organization/utils'
import {Organization as OrganizationTypes} from '#/main/community/organization/prop-types'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {PageContent} from '#/main/app/page'

const Organization = (props) =>
  <ToolPage
    title={trans('organization_name', {name: get(props.organization, 'name', trans('loading'))}, 'community')}
    description={get(props.organization, 'meta.description')}
  >
    {isEmpty(props.organization) &&
      <PageContent className="placeholder-glow">
        <PageHeadingSkeleton
          size="md"
          icon={true}
          description={true}
        />
      </PageContent>
    }

    {!isEmpty(props.organization) &&
      <PageContent>
        <PageHeading
          poster={get(props.organization, 'poster')}
          size="md"
          icon={get(props.organization, 'thumbnail') ?
            <Thumbnail
              size="lg"
              thumbnail={get(props.organization, 'thumbnail')}
              name={get(props.organization, 'name')}
              square={true}
              border={true}
            >
              <span className="fa fa-building" aria-hidden={true} />
            </Thumbnail> :
            undefined
          }
          title={get(props.organization, 'name', trans('loading'))}
          description={get(props.organization, 'meta.description')}
          primaryAction="edit"
          actions={!isEmpty(props.organization) ? getActions([props.organization], {
            add: () => props.reload(props.organization.id),
            update: () => props.reload(props.organization.id),
            delete: () => props.reload(props.organization.id)
          }, props.path, props.currentUser) : []}
        />
        {props.children}
      </PageContent>
    }
  </ToolPage>

Organization.propTypes = {
  path: T.string,
  organization: T.shape(
    OrganizationTypes.propTypes
  ),
  currentUser: T.object,
  children: T.any,
  reload: T.func
}

Organization.defaultProps = {
  breadcrumb: []
}

const OrganizationPage = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state)
  })
)(Organization)

export {
  OrganizationPage
}
