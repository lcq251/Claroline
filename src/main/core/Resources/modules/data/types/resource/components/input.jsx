import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {MODAL_RESOURCES} from '#/main/core/modals/resources'
import {EntityInput} from '#/main/app/data/types/entity'
import isEmpty from 'lodash/isEmpty'
import {ResourceCard} from '#/main/core/resource/components/card'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {route} from '#/main/core/resource'
import {Button} from '#/main/app/action'
import {ResourceEmbedded} from '#/main/core/resource/containers/embedded'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

const ResourceInputOld = props => {
  if (!isEmpty(props.value) && props.embedded) {
    return (
      <div id={props.id} className="position-relative">
        <Button
          className="position-absolute bottom-100 end-0 text-lowercase"
          variant="btn-text"
          type={CALLBACK_BUTTON}
          label={trans('delete', {}, 'actions')}
          dangerous={true}
          size="sm"
          disabled={props.disabled}
          callback={() => props.onChange(null)}
        />

        <ResourceEmbedded
          resourceNode={props.value}
        />
      </div>
    )
  }

  return (
    <ContentPlaceholder
      id={props.id}
      icon="fa fa-folder"
      title={trans('no_resource', {}, 'resource')}
      size={props.size}
    >
      <Button
        className="btn btn-outline-primary w-100 mt-2"
        type={MODAL_BUTTON}
        icon="fa fa-fw fa-plus"
        label={trans('add_resource', {}, 'resource')}
        modal={[MODAL_RESOURCES, {
          ...props.picker,
          selectAction: (selected) => ({
            type: CALLBACK_BUTTON,
            label: trans('add', {}, 'actions'),
            callback: () => props.onChange(selected[0])
          })
        }]}
        size={props.size}
        disabled={props.disabled}
      />
    </ContentPlaceholder>
  )
}

const ResourceInput = props =>
  <EntityInput
    {...props}
    add={trans(props.multiple ? 'add_resources' : 'add_resource', {}, 'actions')}
    pickerType={MODAL_RESOURCES}
  />

implementPropTypes(ResourceInput, DataInputTypes, {
  value: T.shape(
    ResourceNodeTypes.propTypes
  ),
  embedded: T.bool,
  picker: T.shape({
    current: T.shape({
      slug: T.string.isRequired,
      name: T.string.isRequired
    }),
    contextId: T.string,
    filters: T.array
  })
}, {
  value: null,
  picker: {
    current: null,
    filters: [],
    root: null
  }
})

export {
  ResourceInput
}
