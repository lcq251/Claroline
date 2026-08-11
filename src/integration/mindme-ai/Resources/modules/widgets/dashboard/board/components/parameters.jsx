import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

/**
 * dashboard-board parameters: showEmptyHint (bool).
 */
const BoardParameters = props => (
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
            name: 'parameters.showEmptyHint',
            label: trans('dashboard_board_showEmptyHint', {}, 'widget'),
            help: trans('dashboard_board_showEmptyHint_help', {}, 'widget'),
            type: 'bool'
          }
        ]
      }
    ]}
  />
)

BoardParameters.propTypes = {
  name: T.string.isRequired
}

export {
  BoardParameters
}
