import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {DataMicro} from '#/main/app/data/components/micro'

import {WorkspaceCard} from '#/main/core/workspace/components/card'

const WorkspacesModal = (props) =>
  <PickerModal
    {...omit(props)}
    icon="fa fa-fw fa-book"
    name="workspacesPicker"
    definition={[
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
        label: trans('code')
      }, {
        name: 'meta.created',
        label: trans('creation_date'),
        type: 'date',
        alias: 'createdAt',
        filterable: false
      }, {
        name: 'meta.updated',
        label: trans('modification_date'),
        type: 'date',
        alias: 'updatedAt',
        displayed: true,
        filterable: false,
        options: {time: true}
      }, {
        name: 'meta.creator',
        label: trans('creator'),
        type: 'user',
        alias: 'creator'
      }, {
        name: 'restrictions.hidden',
        label: trans('hidden'),
        type: 'boolean',
        alias: 'hidden',
        displayable: false
      }, {
        name: 'registration.selfRegistration',
        label: trans('public_registration'),
        type: 'boolean',
        alias: 'selfRegistration'
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
    ]}
    card={WorkspaceCard}
  />

WorkspacesModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool,
  // from modal
  fadeModal: T.func.isRequired
}

WorkspacesModal.defaultProps = {
  url: ['apiv2_workspace_list'],
  title: trans('workspaces', {}, 'workspace')
}

export {
  WorkspacesModal
}
