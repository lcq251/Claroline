import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {Tag as TagTypes} from '#/plugin/tag/data/types/tag/prop-types'

const TagModal = (props) =>
  <FormModal
    {...omit(props, 'tag')}
    name="tagForm"
    title={!props.tag ? trans('new_tag', {}, 'tag') : undefined}
    target={!props.tag ?
      ['apiv2_tag_create'] :
      ['apiv2_tag_update', {id: props.tag.id}]
    }
    isNew={!props.tag}
    data={props.tag}
    saveLabel={trans(!props.tag ? 'add_tag' : 'save_tag', {}, 'actions')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: trans('name'),
            required: true
          }, {
            name: 'meta.description',
            type: 'string',
            label: trans('description'),
            recommended: true,
            options: {
              long: true
            }
          }, {
            name: 'color',
            label: trans('color'),
            type: 'color'
          }
        ]
      }
    ]}
  />

TagModal.propTypes = {
  tag: T.shape(TagTypes.propTypes),
  onSave: T.func
}

export {
  TagModal
}
