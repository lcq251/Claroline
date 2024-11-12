import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'

import {TemplateCard} from '#/main/template/data/types/template/components/card'

const TemplatesModal = (props) =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-stamp"
    name="templatesPicker"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        filterable: false,
        options: {
          domain: 'template'
        },
        primary: true
      }, {
        name: 'description',
        type: 'string',
        label: trans('description'),
        displayed: true,
        filterable: false,
        sortable: false,
      }
    ]}
    card={TemplateCard}
  />

TemplatesModal.propTypes = {
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool,

  // from modal
  fadeModal: T.func.isRequired
}

TemplatesModal.defaultProps = {
  url: ['apiv2_template_type_list'],
  title: trans('templates', {}, 'template')
}

export {
  TemplatesModal
}
