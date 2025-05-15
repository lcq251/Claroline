import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {hasPermission} from '#/main/app/security'
import {declareAction} from '#/main/app/action'

/**
 * Browse organization action.
 */
export default declareAction((organizations) => ({
  name: 'browse',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-eye',
  label: trans('browse', {}, 'actions'),
  target: '',
  displayed: hasPermission('open', organizations[0]),
  scope: ['object'],
  exact: true
}))
