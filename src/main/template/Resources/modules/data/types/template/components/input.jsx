import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {TemplateCard} from '#/main/template/data/types/template/components/card'
import {Template as TemplateTypes} from '#/main/template/data/types/template/prop-types'
import {MODAL_TEMPLATES} from '#/main/template/modals/templates'

const TemplateInput = (props) =>
  <EntityInput
    {...props}
    icon="fa fa-stamp"
    placeholder={trans('no_template', {}, 'template')}
    card={TemplateCard}
    multiple={false}
    pickerType={MODAL_TEMPLATES}
    picker={{
      url: ['apiv2_template_type_list', {type: props.templateType}]
    }}
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
