import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Template as TemplateTypes} from '#/main/template/data/types/template/prop-types'
import {TemplateCard} from '#/main/template/data/types/template/components/card'

const TemplateDisplay = (props) =>
  <EntityDisplay
    icon="fa fa-stamp"
    placeholder={trans('no_template', {}, 'template')}
    card={TemplateCard}
    data={props.data}
    multiple={false}
  />

TemplateDisplay.propTypes = {
  data: T.shape(
    TemplateTypes.propTypes
  )
}

export {
  TemplateDisplay
}
