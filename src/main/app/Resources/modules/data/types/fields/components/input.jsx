import React, {Component} from 'react'
import classes from 'classnames'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'

import {implementPropTypes, PropTypes as T} from '#/main/app/prop-types'
import {trans} from '#/main/app/intl/translation'
import {Badge} from '#/main/app/components/badge'
import {MODAL_FIELD_PARAMETERS} from '#/main/app/data/types/fields/modals/parameters'

import {Button} from '#/main/app/action/components/button'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {DataInput} from '#/main/app/data/components/input'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {MODAL_FIELD_CREATION} from '#/main/app/data/types/fields/modals/creation'

const FieldPreview = props =>
  <DataInput
    {...props}
    className="flex-fill mb-0"
    onChange={() => true}
  />

FieldPreview.propTypes = {
  name: T.string.isRequired
}

class FieldsInput extends Component {
  constructor(props) {
    super(props)

    this.add         = this.add.bind(this)
    this.update      = this.update.bind(this)
    this.remove      = this.remove.bind(this)
    this.formatField = this.formatField.bind(this)
  }

  add(newField) {
    const fields = this.props.value.slice()

    // add
    fields.push(newField)

    this.props.onChange(fields)
  }

  update(index, field) {
    const fields = this.props.value.slice()

    // update
    fields[index] = field

    this.props.onChange(fields)
  }

  remove(index) {
    const fields = this.props.value.slice()

    // remove
    fields.splice(index, 1)

    this.props.onChange(fields)
  }

  formatField(field) {
    const options = field.options ? Object.assign({}, field.options) : {}

    // TODO : find a way to remove this hack on choices
    if (field.type === 'choice') {
      options['choices'] = field.options && field.options.choices ?
        field.options.choices.reduce((acc, choice) => {
          acc[choice.value] = choice.value

          return acc
        }, {}) :
        {}
    }

    return Object.assign({}, field, {
      hideLabel: get(field, 'display.hideLabel', false),
      options: options
    })
  }

  render() {
    const allFields = (this.props.fields || this.props.value)
      .map(this.formatField)

    return (
      <div className={classes('field-list-control', this.props.className)} role="presentation">
        {0 === this.props.value.length &&
          <ContentPlaceholder title={this.props.placeholder} size={this.props.size} />
        }

        {0 < this.props.value.length &&
          <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
            {this.props.value
              .sort((a, b) => {
                if (isNumber(get(a, 'display.order')) && !isNumber(get(b, 'display.order'))) {
                  return -1
                } else if (!isNumber(get(a, 'display.order')) && isNumber(get(b, 'display.order'))) {
                  return 1
                } else if (isNumber(get(a, 'display.order')) && isNumber(get(b, 'display.order'))) {
                  return get(a, 'display.order') - get(b, 'display.order')
                } else if (a.label > b.label) {
                  return 1
                }

                return 0
              })
              .map((field, fieldIndex) =>
                <li key={fieldIndex} className="field-item list-group-item d-flex flex-row align-items-start py-3 px-3 gap-3 border rounded-2">
                  <div className="flex-fill" role="presentation">
                    <FieldPreview {...this.formatField(field)} />
                    {get(field, 'restrictions.confidentiality') && 'none' !== get(field, 'restrictions.confidentiality') &&
                      <Badge variant="primary" className="mt-1">
                        <span className="fa fa-fw fa-eye me-2" aria-hidden={true} />
                        {trans('confidentiality_'+field.restrictions.confidentiality)}
                      </Badge>
                    }
                  </div>

                  <Toolbar
                    id={`${this.props.id}-${fieldIndex}-actions`}
                    className="my-n2 me-n2"
                    tooltip="bottom"
                    buttonName="btn p-2"
                    defaultName="btn-text-body focus-ring focus-ring-secondary"
                    size="sm"
                    actions={[
                      {
                        name: 'edit',
                        type: MODAL_BUTTON,
                        icon: 'fa fa-fw fa-pencil',
                        label: trans('edit', {}, 'actions'),
                        modal: [MODAL_FIELD_PARAMETERS, {
                          field: field,
                          isNew: false,
                          fields: allFields.filter(otherField => otherField.id !== field.id),
                          save: (data) => this.update(fieldIndex, data)
                        }]
                      }, {
                        name: 'delete',
                        type: CALLBACK_BUTTON,
                        icon: 'fa fa-fw fa-trash',
                        label: trans('delete', {}, 'actions'),
                        confirm: trans('delete_field_confirm'),
                        callback: () => this.remove(fieldIndex)
                      }
                    ]}
                  />
                </li>
              )
            }
          </ul>
        }

        <Button
          type={MODAL_BUTTON}
          className="btn btn-body w-100 mt-3"
          icon="fa fa-fw fa-plus"
          label={trans('add_field')}
          disabled={this.props.disabled}
          modal={[MODAL_FIELD_CREATION, {
            fields: allFields,
            add: this.add
          }]}
        />
      </div>
    )
  }
}

implementPropTypes(FieldsInput, DataInputTypes, {
  // more precise value type
  value: T.arrayOf(T.object),

  // a list of all fields for conditional rendering
  // it uses the current list of fields in `value` in missing
  // this is useful for profile where fields are propagated between multiple tabs/panels
  fields: T.array
}, {
  placeholder: trans('empty_fields_list'),
  value: []
})

export {
  FieldsInput
}
