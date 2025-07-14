import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

import {route} from '#/plugin/cursus/course/routing'
import {constants, declareAction} from '#/main/app/action'

export default declareAction((courses, refresher, path) => ({
  name: 'edit',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-pencil',
  label: trans('edit', {}, 'actions'),
  target: route(courses[0], null, path) + '/edit',
  displayed: hasPermission('edit', courses[0]),
  group: trans('management'),
  scope: ['object'],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
