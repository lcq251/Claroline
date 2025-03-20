import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {getActions} from '#/plugin/open-badge/badge/utils'
import {Assertion as AssertionTypes, Badge as BadgeTypes} from '#/plugin/open-badge/prop-types'
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
      <PageContent>
        <PageHeadingSkeleton
          size="md"
          icon={true}
          description={true}
        />
      </PageContent>
    }

    {!isEmpty(props.badge) &&
      <PageContent>
        <PageHeading
          size="md"
          poster={get(props.badge, 'poster')}
          icon={<BadgeImage badge={props.badge} size="lg" />}
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
          assertion={props.assertion}
        />
      </PageContent>
    }
  </ToolPage>

Badge.propTypes = {
  path: T.string,
  badge: T.shape(
    BadgeTypes.propTypes
  ),
  assertion: T.shape(
    AssertionTypes.propTypes
  ),
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
