import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {Role as RoleTypes} from '#/main/community/role/prop-types'

const RoleFormModal = (props) =>
  <FormModal
    {...omit(props, 'role')}
    name="roleForm"
    title={trans(props.isNew ? 'new_role' : 'role', {}, 'community')}
    subtitle={props.isNew ? trans('Créez des rôles pour gérer les permissions de vos utilisateurs.') : undefined}
    target={props.isNew ?
      ['apiv2_role_create'] :
      ['apiv2_role_update', {id: props.role.id}]
    }
    data={props.role}
    saveLabel={trans(props.isNew ? 'add_role' : 'save_role', {}, 'actions')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'translationKey',
            type: 'translation',
            label: trans('name'),
            required: true,
            disabled: (role) => get(role, 'meta.readOnly')
          }, {
            name: 'meta.description',
            type: 'string',
            label: trans('description'),
            recommended: true,
            options: {
              long: true
            }
          }
        ]
      }
    ]}
  />

RoleFormModal.propTypes = {
  isNew: T.bool,
  role: T.shape(RoleTypes.propTypes),
  onSave: T.func
}

export {
  RoleFormModal
}
