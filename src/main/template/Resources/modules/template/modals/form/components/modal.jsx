import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {Template} from '#/main/template/prop-types'

const TemplateFormModal = (props) => {
  return (
    <FormModal
      {...omit(props, 'template')}
      name="templateForm"
      title={trans(props.isNew ? 'new_template' : 'template', {}, 'template')}
      target={props.isNew ?
        ['apiv2_template_create'] :
        ['apiv2_template_update', {id: props.template.id}]
      }
      isNew={props.isNew}
      data={props.template}
      saveLabel={trans(props.isNew ? 'add_template' : 'save_template', {}, 'actions')}
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
              name: 'description',
              type: 'string',
              label: trans('description'),
              options: {long: true}
            }, {
              name: 'default',
              type: 'boolean',
              label: trans('template_default', {}, 'template'),
              help: trans('template_default_help', {}, 'template')
            }
          ]
        }
      ]}
    />
  )
}

TemplateFormModal.propTypes = {
  isNew: T.bool,
  template: T.shape(Template.propTypes),
  onSave: T.func
}

export {
  TemplateFormModal
}
