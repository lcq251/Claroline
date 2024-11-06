import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {Thumbnail} from '#/main/app/components/thumbnail'

import {OrganizationCard} from '#/main/community/organization/components/card'

const OrganizationsModal = props => {
  return (
    <PickerModal
      {...omit(props)}
      icon="fa fa-fw fa-building"
      name="organizationsPicker"
      definition={[
        {
          name: 'name',
          type: 'string',
          label: trans('name'),
          displayed: true,
          primary: true,
          render: (organization) => (
            <div className="d-flex flex-direction-row gap-3 align-items-center" role="presentation">
              <Thumbnail thumbnail={organization.thumbnail} name={organization.name} size="xs" square={true} />
              {organization.name}
            </div>
          )
        }, {
          name: 'code',
          type: 'string',
          label: trans('code')
        }, {
          name: 'meta.description',
          type: 'string',
          label: trans('description'),
          options: {long: true},
          displayed: true,
          sortable: false
        }, {
          name: 'meta.default',
          type: 'boolean',
          label: trans('default')
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
  )
}

OrganizationsModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool,
  // from modal
  fadeModal: T.func.isRequired
}

OrganizationsModal.defaultProps = {
  url: ['apiv2_organization_list'],
  title: trans('organizations', {}, 'community')
}

export {
  OrganizationsModal
}
