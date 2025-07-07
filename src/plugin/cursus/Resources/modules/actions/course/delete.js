import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans, transChoice} from '#/main/app/intl/translation'
import {constants, declareAction} from '#/main/app/action'
import get from 'lodash/get'

/**
 * Delete courses action.
 */
export default declareAction((courses, refresher) => {
  const processable = courses.filter(course => hasPermission('administrate', course) && get(course, 'meta.archived'))

  return {
    name: 'delete',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('delete', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('course_delete_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'cursus'),
      additional: trans('irreversible_action_confirm'),
      items:  processable.map(item => ({
        thumbnail: item.thumbnail,
        id: item.id,
        name: item.name
      }))
    },
    request: {
      url: ['apiv2_cursus_course_delete'],
      request: {
        method: 'DELETE',
        body: JSON.stringify(processable.map(course => course.id))
      },
      success: () => refresher.delete(processable)
    },
    group: trans('management'),
    scope: ['object', 'collection'],
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED],
    title: trans('delete_training', {}, 'actions'),
    description: trans('delete_training_help', {}, 'actions'),
    managerOnly: true
  }
})
