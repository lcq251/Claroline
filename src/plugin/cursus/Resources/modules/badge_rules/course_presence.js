import {createElement} from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {declareBadgeRule} from '#/plugin/open-badge/badge-rule'

import {route} from '#/plugin/cursus/course/routing'
import {route as contextRoute} from '#/main/app/context'

export default declareBadgeRule({
  name: 'training_course_presence',
  meta: {
    label: trans('training_course_presence', {}, 'badge')
  },
  render: (rule, contextType, contextId) => createElement(Html, {
    children: trans('training_course_presence_desc', {
      count: `<b>${get(rule, 'data.count', '')}</b>`,
      course: `<a class="fw-bolder text-reset" href="#${route(rule.subject, null, contextRoute(contextType, contextId, 'trainings'))}">`+get(rule, 'subject.name')+'</a>'
    }, 'badge')
  }),
  default: (rule) => Object.assign({}, rule, {
    subjectClass: 'Claroline\\CursusBundle\\Entity\\Course'
  }),
  configure: () => [
    {
      name: 'subject',
      type: 'training_course',
      label: trans('course', {}, 'cursus'),
      required: true
    }, {
      name: 'data.count',
      type: 'number',
      label: trans('count_training_events', {}, 'badge'),
      help: trans('count_training_events_help', {}, 'badge'),
      required: true,
      options: {min: 1}
    }
  ]
})
