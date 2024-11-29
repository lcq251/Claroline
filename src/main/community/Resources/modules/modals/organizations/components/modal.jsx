import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'

import {OrganizationCard} from '#/main/community/organization/components/card'
import {DataMicro} from '#/main/app/data/components/micro'

const OrganizationsModal = (props) =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-building"
    name="organizationsPicker"
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
        options: {long: true},
        displayed: true,
        sortable: false
      }, {
        name: 'code',
        type: 'string',
        label: trans('code')
      }, {
        name: 'email',
        type: 'email',
        label: trans('email')
      }, {
        name: 'restrictions.public',
        alias: 'public',
        type: 'boolean',
        label: trans('public')
      }
    ]}
    card={OrganizationCard}
  />

OrganizationsModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool
}

OrganizationsModal.defaultProps = {
  url: ['apiv2_organization_list'],
  title: trans('organizations', {}, 'community')
}

export {
  OrganizationsModal
}
