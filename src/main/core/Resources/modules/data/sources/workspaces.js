import React from 'react'
import {trans} from '#/main/app/intl/translation'

import {WorkspaceCard} from '#/main/core/workspace/components/card'
import {getActions, getDefaultAction} from '#/main/core/workspace/utils'
import {DataMicro} from '#/main/app/data/components/micro'

export default (contextType, contextData, refresher, currentUser) => ({
  primaryAction: (workspace) => getDefaultAction(workspace, refresher, null, currentUser),
  actions: (workspaces) => getActions(workspaces, refresher, null, currentUser),
  definition: [
    {
      name: 'name',
      type: 'string',
      label: trans('name'),
      displayed: true,
      primary: true,
      render: (row) => <DataMicro object={row} />
    }, {
      name: 'meta.description',
      type: 'string',
      label: trans('description'),
      sortable: false,
      options: {long: true}
    }, {
      name: 'code',
      type: 'string',
      label: trans('code'),
      displayed: true
    }, {
      name: 'meta.created',
      label: trans('creation_date'),
      type: 'date',
      alias: 'createdAt',
      displayed: true,
      filterable: false
    }, {
      name: 'meta.updated',
      label: trans('modification_date'),
      type: 'date',
      alias: 'updatedAt',
      filterable: false
    }, {
      name: 'archived',
      label: trans('archived'),
      type: 'boolean',
      filterable: true,
      displayable: false
    }, {
      name: 'restrictions.hidden',
      label: trans('hidden'),
      type: 'boolean',
      alias: 'hidden',
      filterable: true,
      displayable: false
    }, {
      name: 'tags',
      type: 'tag',
      label: trans('tags'),
      displayable: true,
      sortable: false,
      options: {
        objectClass: 'Claroline\\CoreBundle\\Entity\\Workspace\\Workspace'
      }
    }
  ],
  card: WorkspaceCard
})
