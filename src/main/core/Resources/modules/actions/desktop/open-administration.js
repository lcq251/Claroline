import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/app/context/routing'

/**
 * Open the Administration context.
 */
export default () => ({
  name: 'administration',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-cogs',
  label: trans('open-administration', {}, 'actions'),
  target: route('administration'),
  scope: ['object'],
  group: trans('management')
})
