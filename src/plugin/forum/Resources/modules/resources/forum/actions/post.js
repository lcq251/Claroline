import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {constants} from '#/main/app/action'
import {hasPermission} from '#/main/app/security'

export default (resourceNodes, nodesRefresher, path) => ({
  name: 'post',
  type: LINK_BUTTON,
  label: trans('add_subject', {}, 'actions'),
  icon: 'fa fa-fw fa-plus',
  primary: true,
  target: `${path}/${resourceNodes[0].slug}/subjects`,
  exact: true,
  displayed: hasPermission(resourceNodes[0], 'post'),
  scope: [constants.ACTION_SCOPE_OBJECT],
  set: [constants.ACTION_SET_DETAILS]
})
