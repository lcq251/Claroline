import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/core/tool/routing'

/**
 * Displays a form to modify tool properties.
 */
export default (tools, toolRefresher, path) => ({
  name: 'configure',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-sliders',
  label: trans('configure', {}, 'actions'),
  target: route(tools[0].name, path) + '/edit',
  displayed: hasPermission('edit', tools[0]),
  group: trans('management'),
  scope: ['object']
})
