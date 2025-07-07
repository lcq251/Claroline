import get from 'lodash/get'

import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Restore action.
 */
export default declareAction((courses, refresher) => {
  const processable = courses.filter(course => hasPermission('administrate', course) && get(course, 'meta.archived'))

  return {
    name: 'restore',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-box-open',
    label: trans('restore', {}, 'actions'),
    displayed: 0 !== processable.length,
    request: {
      url: ['apiv2_cursus_course_restore'],
      request: {
        method: 'POST',
        body: JSON.stringify(processable.map(course => course.id))
      },
      success: (response) => refresher.update(response)
    },
    group: trans('management'),
    scope: ['object', 'collection'],
    dangerous: true,
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED],
    title: trans('restore_training', {}, 'actions'),
    description: trans('restore_training_help', {}, 'actions'),
    managerOnly: true
  }
})
