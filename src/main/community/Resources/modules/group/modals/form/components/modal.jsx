import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {Group as GroupTypes} from '#/main/community/group/prop-types'

const GroupFormModal = (props) =>
  <FormModal
    {...omit(props, 'group')}
    name="groupForm"
    title={trans(props.isNew ? 'new_group' : 'group', {}, 'community')}
    subtitle={props.isNew ? trans('Créez des groupes pour simplifier la gestion de vos utilisateurs.') : undefined}
    target={props.isNew ?
      ['apiv2_group_create'] :
      ['apiv2_group_update', {id: props.group.id}]
    }
    data={props.group}
    saveLabel={trans(props.isNew ? 'add_group' : 'save_group', {}, 'actions')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'poster',
            type: 'poster',
            label: trans('poster'),
            hideLabel: true
          }, {
            name: 'thumbnail',
            type: 'image',
            label: trans('thumbnail'),
            recommended: true
          }, {
            name: 'name',
            type: 'string',
            label: trans('name'),
            required: true
          }, {
            name: 'code',
            type: 'string',
            required: true,
            label: trans('code'),
            options: {
              unique: {
                check: ['apiv2_group_get', {field: 'code'}]
              }
            }
          }, {
            name: 'meta.everyone',
            type: 'boolean',
            label: trans('group_everyone', {}, 'community'),
            help:  trans('group_everyone_help', {}, 'community')
          }
        ]
      }, {
        title: trans('further_information'),
        description: trans('further_information_help'),
        primary: true,
        fields: [
          {
            name: 'meta.description',
            type: 'string',
            label: trans('description'),
            options: {
              long: true
            }
          }
        ]
      }
    ]}
  />

GroupFormModal.propTypes = {
  isNew: T.bool,
  group: T.shape(GroupTypes.propTypes),
  onSave: T.func
}

export {
  GroupFormModal
}
