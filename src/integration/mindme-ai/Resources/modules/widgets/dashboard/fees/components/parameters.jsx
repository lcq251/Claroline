import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

/**
 * dashboard-fees parameters: maxItems (number).
 * `income` has no parameter (its state is fully driven by data.income.status, D3/U5).
 */
const FeesParameters = props => (
  <FormContent
    level={5}
    flush={true}
    name={props.name}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'parameters.maxItems',
            label: trans('dashboard_fees_maxItems', {}, 'widget'),
            type: 'number',
            default: 3
          }
        ]
      }
    ]}
  />
)

FeesParameters.propTypes = {
  name: T.string.isRequired
}

export {
  FeesParameters
}
