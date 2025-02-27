import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/core/resource'
import {hasPermission} from '#/main/app/security'

/**
 * Displays a form to modify resource node properties.
 */
export default (resourceNodes, nodesRefresher, path) => ({
  name: 'show-dashboard',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-sliders',
  label: trans('show-dashboard', {}, 'actions'),
  target: `${route(resourceNodes[0], path)}/dashboard`,
  displayed: -1 !== resourceNodes.findIndex(resourceNode => hasPermission('edit', resourceNode)),
  scope: ['object'],
  group: trans('management')
})
