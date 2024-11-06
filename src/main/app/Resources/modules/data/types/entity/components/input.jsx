import React, {createElement} from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import isEmpty from 'lodash/isEmpty'

const PickerButton = props =>
  <Button
    className="btn btn-body w-100 mt-3"
    type={MODAL_BUTTON}
    icon="fa fa-fw fa-plus"
    label={trans('add', {}, 'actions')}
    modal={[props.type, {
      url: props.url,
      title: props.title,
      filters: props.filters,
      multiple: props.multiple,
      selectAction: (selected) => ({
        type: CALLBACK_BUTTON,
        label: trans('add', {}, 'actions'),
        callback: () => {
          if (props.multiple) {
            const newValue = [].concat(props.value || [])
            selected.forEach(object => {
              const index = newValue.findIndex(o => o.id === object.id)

              if (-1 === index) {
                newValue.push(object)
              }
            })

            props.onChange(newValue)
          } else {
            props.onChange(selected[0])
          }
        }
      })
    }]}
    size={props.size}
    disabled={props.disabled}
  />

PickerButton.propTypes = {
  type: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  filters: T.arrayOf(T.shape({
    // list filter types
  })),
  value: T.oneOfType([
    T.object, // multiple = false
    T.arrayOf(T.object) // multiple = true
  ]),
  onChange: T.func.isRequired,
  size: T.string,
  disabled: T.bool,
  multiple: T.bool
}

const EntityInput = props => {
  if (!isEmpty(props.value)) {
    return (
      <>
        {props.multiple &&
          <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
            {props.value.map(object => (
              <li key={object.id}>
                {createElement(props.card, {
                  data: object,
                  size: 'sm',
                  actions: [{
                    name: 'delete',
                    type: CALLBACK_BUTTON,
                    icon: 'fa fa-fw fa-times',
                    label: trans('delete', {}, 'actions'),
                    displayed: !props.disabled,
                    callback: () => {
                      const newValue = [].concat(props.value || [])
                      const index = newValue.findIndex(o => o.id === object.id)

                      if (-1 < index) {
                        newValue.splice(index, 1)
                        props.onChange(newValue)
                      }
                    }
                  }]
                })}
              </li>
            ))}
          </ul>
        }

        {!props.multiple && createElement(props.card, {
          data: props.value,
          size: 'sm',
          actions: [{
            name: 'delete',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-times',
            label: trans('delete', {}, 'actions'),
            displayed: !props.disabled,
            callback: () => props.onChange(null)
          }]
        })}

        {!props.disabled &&
          <PickerButton
            {...props.picker}
            type={props.pickerType}
            size={props.size}
            value={props.value}
            onChange={props.onChange}
            multiple={props.multiple}
          />
        }
      </>
    )
  }

  return (
    <ContentPlaceholder
      id={props.id}
      icon={props.icon}
      title={props.placeholder}
      size={props.size}
    >
      <PickerButton
        {...props.picker}
        type={props.pickerType}
        size={props.size}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        multiple={props.multiple}
      />
    </ContentPlaceholder>
  )
}

implementPropTypes(EntityInput, DataInputTypes, {
  value: T.oneOfType([
    T.object, // multiple = false
    T.arrayOf(T.object) // multiple = true
  ]),

  /**
   * The name of a registered modal to use as a picker for the input.
   */
  pickerType: T.string.isRequired,

  /**
   * Custom configuration for the picker
   */
  picker: T.shape({
    url: T.oneOfType([T.string, T.array]),
    title: T.string,
    filters: T.arrayOf(T.shape({
      // list filter types
    }))
  }),

  /**
   * The Card component of the entity.
   */
  card: T.any.isRequired,
  icon: T.string,
  placeholder: T.string,
  multiple: T.bool
}, {
  value: null,
  picker: {},
  multiple: false
})

export {
  EntityInput
}
