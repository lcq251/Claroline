import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {PageSection} from '#/main/app/page/components/section'
import {Alert} from '#/main/app/components/alert'
import {Html} from '#/main/app/components/html'
import {Content} from '#/main/app/components/content'

import {Assertion as AssertionTypes, Badge as BadgeTypes} from '#/plugin/open-badge/prop-types'
import {AssertionUserCard} from '#/plugin/open-badge/assertion/components/card'
import {BadgeMyAssertion} from '#/plugin/open-badge/badge/components/my-assertion'
import {AssertionList} from '#/plugin/open-badge/assertion/components/list'
import {selectors}  from '#/plugin/open-badge/tools/badges/store'

const BadgeDetails = (props) => {
  return (
    <>
      <PageSection size="md" className="mb-5">
        <BadgeMyAssertion assertion={props.assertion} />
      </PageSection>

      {(get(props.badge, 'meta.descriptionHtml') || !isEmpty(get(props.badge, 'tags'))) &&
        <PageSection size="md" className="pb-5">
          <Content
            tags={get(props.badge, 'tags')}
          >
            {get(props.badge, 'meta.descriptionHtml')}
          </Content>
        </PageSection>
      }

      <PageSection
        size="md"
        className="bg-body-tertiary py-4"
        title={trans('Comment obtenir ce badge ?', {}, 'badge')}
      >
        {get(props.badge, 'meta.archived', false) &&
          <Alert type="info">
            {trans('badge_archived_help', {}, 'badge')}
          </Alert>
        }

        <div className="card mb-4">
          <Html className="content-text card-body">{!isEmpty(props.badge.criteria) ? props.badge.criteria : trans('no_criteria', {}, 'badge')}</Html>
        </div>
      </PageSection>

      {(hasPermission('grant', props.badge) || !get(props.badge, 'restrictions.hideRecipients')) &&
        <PageSection
          size="md"
          className="py-4"
          title={trans('Utilisateurs ayant obtenu ce badge', {}, 'badges')}
        >
          <AssertionList
            className="mb-4"
            path={props.path}
            name={selectors.FORM_NAME + '.assertions'}
            url={['apiv2_badge_list_assertions', {badge: props.badge.id}]}
            primaryAction={undefined}
            customDefinition={[
              {
                name: 'user',
                type: 'user',
                label: trans('user'),
                displayed: true
              }, {
                name: 'user.email',
                type: 'email',
                label: trans('email'),
                sortable: false,
                filterable: false
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
                name: 'userDisabled',
                label: trans('user_disabled', {}, 'community'),
                type: 'boolean',
                displayable: false,
                sortable: false,
                filterable: true
              }
            ]}
            card={AssertionUserCard}
          />
        </PageSection>
      }
    </>
  )
}

BadgeDetails.propTypes = {
  path: T.string.isRequired,
  badge: T.shape(
    BadgeTypes.propTypes
  ).isRequired,
  assertion: T.shape(
    AssertionTypes.propTypes
  )
}

export {
  BadgeDetails
}
