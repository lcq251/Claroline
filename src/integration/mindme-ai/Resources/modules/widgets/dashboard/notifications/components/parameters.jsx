import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

/**
 * dashboard-notifications parameters: maxItems (number) + showDescription (bool).
 */
const NotificationsParameters = props => (
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
            label: trans('dashboard_notifications_maxItems', {}, 'widget'),
            type: 'number',
            default: 3
          },
          {
            name: 'parameters.showDescription',
            label: trans('dashboard_notifications_showDescription', {}, 'widget'),
            type: 'bool'
          }
        ]
      }
    ]}
  />
)

NotificationsParameters.propTypes = {
  name: T.string.isRequired
}

export {
  NotificationsParameters
}
