import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {DataMicro} from '#/main/app/data/components/micro'

import {GroupCard} from '#/main/community/group/components/card'

const GroupsModal = (props) =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-users"
    name="groupsPicker"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true,
        filterable: false,
        render: (row) => <DataMicro object={row} />
      }, {
        name: 'code',
        type: 'string',
        label: trans('code'),
        filterable: false
      }, {
        name: 'meta.description',
        type: 'string',
        label: trans('description'),
        options: {long: true},
        displayed: true,
        filterable: false
      }
    ]}
    card={GroupCard}
  />

GroupsModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool
}

GroupsModal.defaultProps = {
  url: ['apiv2_group_list'],
  title: trans('groups', {}, 'community')
}

export {
  GroupsModal
}
