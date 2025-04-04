import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {PageListSection} from '#/main/app/page'
import {ToolPage} from '#/main/core/tool'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {AssertionBadgeCard} from '#/plugin/open-badge/assertion/components/card'
import {AssertionList} from '#/plugin/open-badge/assertion/components/list'
import {selectors} from '#/plugin/open-badge/tools/badges/store'

const AssertionsList = (props) =>
  <ToolPage title={trans('my_badges', {}, 'badge')}>
    <PageListSection
      poster={props.poster}
      title={trans('my_badges', {}, 'badge')}
    >
      <AssertionList
        className="mb-5"
        flush={true}
        path={props.path}
        name={selectors.STORE_NAME + '.mine'}
        url={['apiv2_badge_assertion_current_user_list', {workspace: props.contextData ? props.contextData.id : null}]}
        customDefinition={[
          {
            name: 'badge.name',
            type: 'string',
            label: trans('name'),
            displayed: true,
            primary: true
          }, {
            name: 'issuedOn',
            label: trans('granted_date', {}, 'badge'),
            type: 'date',
            displayed: true,
            primary: true,
            options: {
              time: true
            }
          }, {
            name: 'badge.archived',
            type: 'boolean',
            label: trans('archived'),
            displayed: true
          }
        ]}
        card={AssertionBadgeCard}
      />
    </PageListSection>
  </ToolPage>

AssertionsList.propTypes = {
  path: T.string.isRequired,
  poster: T.string,
  contextData: T.object
}

const Assertions = connect(
  (state) => ({
    path: toolSelectors.path(state),
    poster: toolSelectors.poster(state),
    contextData: toolSelectors.contextData(state)
  })
)(AssertionsList)

export {
  Assertions
}
