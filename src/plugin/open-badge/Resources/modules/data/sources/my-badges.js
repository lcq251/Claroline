import React from 'react'

import {trans} from '#/main/app/intl/translation'

import {route as toolRoute} from '#/main/core/tool/routing'
import {route as workspaceRoute} from '#/main/core/workspace/routing'

import {AssertionBadgeCard} from '#/plugin/open-badge/assertion/components/card'
import {BadgeImage} from '#/plugin/open-badge/badge/components/image'
import {getActions, getDefaultAction} from '#/plugin/open-badge/assertion/utils'

export default (contextType, contextData, refresher, currentUser) => {
  let basePath
  if ('workspace' === contextType) {
    basePath = workspaceRoute(contextData, 'badges')
  } else {
    basePath = toolRoute('badges')
  }

  return {
    primaryAction: (badge) => getDefaultAction(badge, refresher, basePath, currentUser),
    actions: (badges) => getActions(badges, refresher, basePath, currentUser),
    definition: [
      {
        name: 'badge.name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true,
        render: (assertion) => (
          <div className="d-flex flex-direction-row gap-3 align-items-center">
            <BadgeImage badge={assertion.badge} size="xs" />
            {assertion.badge.name}
          </div>
        )
      }, {
        name: 'badge.meta.description',
        alias: 'badge.archived',
        type: 'boolean',
        label: trans('description')
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
        name: 'badge.meta.archived',
        alias: 'badge.archived',
        type: 'boolean',
        label: trans('archived')
      }
    ],
    card: AssertionBadgeCard
  }
}
