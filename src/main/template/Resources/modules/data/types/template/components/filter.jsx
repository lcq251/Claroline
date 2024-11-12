import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'

import {MODAL_TEMPLATES} from '#/main/template/modals/templates'

const TemplateFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-stamp"
    pickerType={MODAL_TEMPLATES}
    picker={{
      url: ['apiv2_template_type_list', {type: props.templateType}]
    }}
  />

TemplateFilter.propTypes = EntityFilter.propTypes


export {
  TemplateFilter
}
