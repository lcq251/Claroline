import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'
import cloneDeep from 'lodash/cloneDeep'

import {trans} from '#/main/app/intl/translation'
import {FormGroup} from '#/main/app/content/form/components/group'
import {DataInput} from '#/main/app/data/components/input'
import {CallbackButton} from '#/main/app/buttons'

import {makeId} from '#/main/app/utils/id'

import {Category as CategoryTypes} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

const supportedTypes = ['number', 'string', 'choice', 'country', 'cascade']

class FieldsValues extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedField: null
    }
  }

  addField(field) {
    if (field) {
      const newFieldsValues = cloneDeep(this.props.formData.fieldsValues)
      newFieldsValues.push({
        id: makeId(),
        category: this.props.category,
        field: field,
        value: 'cascade' === field.type ? [] : null
      })
      this.props.updateProp('fieldsValues', newFieldsValues)

      this.setState({selectedField: null})
    }
  }

  removeField(fieldIndex) {
    const newFieldsValues = cloneDeep(this.props.formData.fieldsValues)
    newFieldsValues.splice(fieldIndex, 1)
    this.props.updateProp('fieldsValues', newFieldsValues)
  }

  updateFieldValue(fieldIndex, value) {
    const newFieldsValues = cloneDeep(this.props.formData.fieldsValues)
    newFieldsValues[fieldIndex].value = value
    this.props.updateProp('fieldsValues', newFieldsValues)
  }

  formatOptions(options, type) {
    const formattedOptions = cloneDeep(options)

    if (options.choices && 'choice' === type) {
      formattedOptions['choices'] = options.choices.reduce((acc, choice) => {
        acc[choice.value] = choice.value

        return acc
      }, {})
    }

    return formattedOptions
  }

  render() {
    return (
      <FormGroup id="fields-values">
        <DataInput
          label={trans('add_field')}
          type="choice"
          options={{
            multiple: false,
            condensed: true,
            choices: this.props.fields.filter(f => f.id && -1 < supportedTypes.indexOf(f.type)).reduce((acc, field) => {
              acc[field.id] = field.label

              return acc
            }, {})
          }}
          value={this.state.selectedField}
          onChange={(value) => this.setState({selectedField: value})}
        />
        <CallbackButton
          className="btn btn-body mt-2"
          callback={() => this.addField(this.props.fields.find(f => f.id === this.state.selectedField))}
          disabled={!this.state.selectedField}
        >
          {trans('add', {}, 'actions')}
        </CallbackButton>

        {this.props.formData.fieldsValues.map((fv, idx) =>
          <div key={`field-value-${idx}`}>
            <hr/>
            <CallbackButton
              className="btn btn-sm btn-link pull-right"
              callback={() => this.removeField(idx)}
              dangerous={true}
            >
              <span className="fa fa-trash" />
            </CallbackButton>
            <DataInput
              label={fv.field.label}
              type={fv.field.type}
              options={fv.field.options ? this.formatOptions(fv.field.options, fv.field.type) : {}}
              value={fv.value}
              onChange={(value) => this.updateFieldValue(idx, value)}
            />
          </div>
        )}
      </FormGroup>
    )
  }
}

const CategoryFormModal = props => {
  const FieldsValuesComponent = (
    <FieldsValues
      {...props}
    />
  )

  return (
    <FormModal
      {...omit(props, 'formData', 'fields', 'category', 'saveCategory', 'updateProp')}
      name="clacoFormCategoryForm"
      title={trans(props.isNew ? 'new_category' : 'category', {}, 'clacoform')}
      subtitle={props.isNew ? trans('new_category_desc', {}, 'clacoform') : undefined}
      saveLabel={trans(props.isNew ? 'add_category' : 'save_category', {}, 'actions')}
      data={props.category || {
        name: '',
        managers: [],
        details: {
          color: '',
          notify_addition: true,
          notify_edition: true,
          notify_removal: true
        },
        fieldsValues: []
      }}
      definition={[
        {
          id: 'general',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'name',
              type: 'string',
              label: trans('name'),
              required: true
            }, {
              name: 'managers',
              label: trans('managers'),
              type: 'user',
              options: {multiple: true}
            }
          ]
        }, {
          id: 'fields',
          icon: 'fa fa-fw fa-link',
          title: trans('fields_associations', {}, 'clacoform'),
          fields: [
            {
              name: 'fieldsValues',
              label: trans('fields_associations', {}, 'clacoform'),
              hideLabel: true,
              component: FieldsValuesComponent
            }
          ]
        }, {
          id: 'notifications',
          icon: 'fa fa-fw fa-bell',
          title: trans('notifications'),
          fields: [
            {
              name: 'notifications',
              label: trans('notified_actions'),
              type: 'choice',
              options: {
                multiple: true,
                inline: false,
                choices: {
                  notify_addition: trans('addition', {}, 'clacoform'),
                  notify_edition: trans('edition'),
                  notify_removal: trans('removal', {}, 'clacoform')
                }
              },
              calculated: (category) => [
                'notify_addition',
                'notify_edition',
                'notify_removal'
              ].filter(prop => category && category.details && category.details[prop]),
              onChange: (value) => {
                props.updateProp('details.notify_addition', -1 !== value.indexOf('notify_addition'))
                props.updateProp('details.notify_edition', -1 !== value.indexOf('notify_edition'))
                props.updateProp('details.notify_removal', -1 !== value.indexOf('notify_removal'))
              }
            }
          ]
        }
      ]}
    />
  )
}

CategoryFormModal.propTypes = {
  formData: T.shape(
    CategoryTypes.propTypes
  ),
  category: T.shape(
    CategoryTypes.propTypes
  ),
  fields: T.arrayOf(T.shape({
    // field propTypes
  })),
  updateProp: T.func.isRequired,
  onSave: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  CategoryFormModal
}
