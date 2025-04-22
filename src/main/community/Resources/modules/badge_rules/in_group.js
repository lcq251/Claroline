import {createElement} from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {declareBadgeRule} from '#/plugin/open-badge/badge-rule'
import {route as contextRoute} from '#/main/app/context'
import {route} from '#/main/community/group/routing'

export default declareBadgeRule({
  name: 'in_group',
  meta: {
    label: trans('in_group', {}, 'badge')
  },
  render: (rule, contextType, contextId) => createElement(Html, {
    children: trans('in_group_desc', {
      group: `<a class="fw-bolder text-reset" href="#${route(rule.subject, contextRoute(contextType, contextId, 'community'))}">`+get(rule, 'subject.name')+'</a>'
    }, 'badge')
  }),
  default: (rule) => Object.assign({}, rule, {
    subjectClass: 'Claroline\\CoreBundle\\Entity\\Group'
  }),
  configure: (contextType, contextId) => [
    {
      name: 'subject',
      type: 'group',
      label: trans('group', {}, 'community'),
      required: true,
      options: {
        contextType: contextType,
        contextId: contextId
      }
    }
  ]
})
