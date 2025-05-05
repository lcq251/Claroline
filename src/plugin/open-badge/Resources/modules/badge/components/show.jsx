import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {getActions} from '#/plugin/open-badge/badge/utils'
import {Assertion as AssertionTypes, Badge as BadgeTypes, Evidence as EvidenceTypes} from '#/plugin/open-badge/prop-types'
import {BadgeImage} from '#/plugin/open-badge/badge/components/image'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {PageContent} from '#/main/app/page'
import {BadgeDetails} from '#/plugin/open-badge/badge/components/details'

const Badge = (props) =>
  <ToolPage
    title={trans('badge_name', {name: get(props.badge, 'name', trans('loading'))}, 'badge')}
    description={get(props.badge, 'meta.description')}
  >
    {isEmpty(props.badge) &&
      <PageContent className="placeholder-glow">
        <PageHeadingSkeleton
          icon={true}
          description={true}
        />
      </PageContent>
    }

    {!isEmpty(props.badge) &&
      <PageContent poster={get(props.badge, 'poster')}>
        <PageHeading
          icon={<BadgeImage badge={props.badge} size="lg" border={true} />}
          title={get(props.badge, 'name')}
          description={get(props.badge, 'meta.description')}
          primaryAction="edit"
          actions={!isEmpty(props.badge) ? getActions([props.badge], {
            add: () => props.reload(props.badge.id),
            update: () => props.reload(props.badge.id),
            delete: () => props.reload(props.badge.id)
          }, props.path, props.currentUser) : []}
        />

        <BadgeDetails
          path={props.path}
          badge={props.badge}
          contextType={props.contextType}
          contextId={props.contextId}
          assertion={props.assertion}
          evidences={props.evidences}
        />
      </PageContent>
    }
  </ToolPage>

Badge.propTypes = {
  path: T.string,
  contextType: T.string.isRequired,
  contextId: T.string,
  badge: T.shape(
    BadgeTypes.propTypes
  ),
  assertion: T.shape(
    AssertionTypes.propTypes
  ),
  evidences: T.arrayOf(T.shape(
    EvidenceTypes.propTypes
  )),
  currentUser: T.object,
  reload: T.func
}

const BadgeShow = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state)
  })
)(Badge)

export {
  BadgeShow
}
