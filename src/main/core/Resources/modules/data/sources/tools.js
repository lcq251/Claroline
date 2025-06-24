import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {URL_BUTTON} from '#/main/app/buttons'
import {route} from '#/main/app/context/routing'
import {ToolCard} from '#/main/core/tool/components/card'

export default (contextType, contextData) => ({
  primaryAction: (tool) => ({
    type: URL_BUTTON,
    target: `#${route(contextType, get(contextData, 'id'), tool.name)}`
  }),
  definition: [
    {
      name: 'name',
      label: trans('name'),
      displayed: true,
      primary: true
    }, {
      name: 'display.order',
      alias: 'order',
      type: 'number',
      label: trans('order'),
      displayable: false,
      filterable: false,
      sortable: true
    }, {
      name: 'restrictions.hidden',
      alias: 'hidden',
      type: 'boolean',
      label: trans('hidden'),
      displayable: false,
      filterable: true,
      sortable: false
    }
  ],
  card: ToolCard
})
