import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'

import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {RoleCard} from '#/main/community/role/components/card'
import {constants} from '#/main/community/constants'

const RolesModal = (props) =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-id-badge"
    name="rolePicker"
    definition={[
      {
        name: 'translationKey',
        type: 'translation',
        label: trans('name'),
        displayed: true,
        primary: true
      }, {
        name: 'name',
        type: 'string',
        label: trans('code'),
        displayed: false
      }, {
        name: 'type',
        type: 'choice',
        label: trans('type'),
        options: {
          choices: constants.ROLE_TYPES
        },
        displayed: true
      }, {
        name: 'meta.description',
        type: 'string',
        label: trans('description'),
        options: {long: true},
        displayed: true,
        sortable: false
      }, {
        name: 'workspace',
        type: 'workspace',
        label: trans('workspace'),
        displayed: true
      }, {
        name: 'user',
        type: 'user',
        label: trans('user'),
        filterable: false,
        options: {
          placeholder: false
        }
      }
    ]}
    card={RoleCard}
  />

RolesModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool
}

RolesModal.defaultProps = {
  url: ['apiv2_role_list'],
  title: trans('roles', {}, 'community')
}

export {
  RolesModal
}
