import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {DetailsData} from '#/main/app/content/details/containers/data'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {PageSection} from '#/main/app/page/components/section'

import {UserList} from '#/main/community/user/components/list'
import {MODAL_USERS} from '#/main/community/modals/users'

import {Organization as OrganizationTypes} from '#/main/community/organization/prop-types'
import {OrganizationPage} from '#/main/community/organization/components/page'
import {selectors} from '#/main/community/tools/organizations/store'

const OrganizationShow = props =>
  <OrganizationPage
    path={props.path}
    organization={props.organization}
    reload={props.reload}
  >
    <PageSection size="md" className="bg-body-tertiary">
      <DetailsData
        className="mt-3"
        name={selectors.FORM_NAME}
        definition={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'email',
                type: 'email',
                label: trans('email'),
              }, {
                name: 'phone',
                type: 'phone',
                label: trans('phone'),
              }, {
                name: 'address',
                type: 'address',
                label: trans('address'),
              }, {
                name: 'code',
                type: 'string',
                label: trans('code')
              }
            ]
          }
        ]}
      />
    </PageSection>

    <PageSection size="md" title={trans('managers', {}, 'community')}>
      <UserList
        className="mb-5"
        path={props.path}
        name={`${selectors.FORM_NAME}.managers`}
        url={['apiv2_organization_list_managers', {id: props.organization.id}]}
        autoload={!!props.organization.id}
        addAction={{
          name: 'add-managers',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-plus',
          tooltip: 'bottom',
          label: trans('add_managers'),
          displayed: hasPermission('edit', props.organization),
          modal: [MODAL_USERS, {
            selectAction: (users) => ({
              type: CALLBACK_BUTTON,
              label: trans('add', {}, 'actions'),
              callback: () => props.addManagers(props.organization.id, users.map(user => user.id))
            })
          }]
        }}
        delete={{
          url: ['apiv2_organization_remove_managers', {id: props.organization.id}],
          displayed: () => hasPermission('edit', props.organization)
        }}
        actions={undefined}
      />
    </PageSection>
  </OrganizationPage>

OrganizationShow.propTypes = {
  path: T.string.isRequired,
  organization: T.shape(
    OrganizationTypes.propTypes
  ).isRequired,
  reload: T.func.isRequired,
  addManagers: T.func.isRequired
}

export {
  OrganizationShow
}
