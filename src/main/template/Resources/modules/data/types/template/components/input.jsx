import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {Template as TemplateTypes} from '#/main/template/data/types/template/prop-types'
import {MODAL_TEMPLATES} from '#/main/template/modals/templates'
import {trans} from '#/main/app/intl'

const TemplateInput = (props) =>
  <EntityInput
    {...props}
    multiple={false}
    pickerType={MODAL_TEMPLATES}
    picker={{
      url: ['apiv2_template_type_list', {type: props.templateType}]
    }}
    add={trans('add_template', {}, 'actions')}
  />

implementPropTypes(TemplateInput, DataInputTypes, {
  templateType: T.string,
  value: T.shape(
    TemplateTypes.propTypes
  )
})

export {
  TemplateInput
}
