import {createElement} from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {declareBadgeRule} from '#/plugin/open-badge/badge-rule'

import {route} from '#/main/community/team/routing'
import {route as contextRoute} from '#/main/app/context'

export default declareBadgeRule({
  name: 'in_team',
  meta: {
    label: trans('in_team', {}, 'badge')
  },
  render: (rule, contextType, contextId) => createElement(Html, {
    children: trans('in_team_desc', {
      team: `<a class="fw-bolder text-reset" href="#${route(rule.subject, contextRoute(contextType, contextId, 'community'))}">`+get(rule, 'subject.name')+'</a>'
    }, 'badge')
  }),
  default: (rule) => Object.assign({}, rule, {
    subjectClass: 'Claroline\\CommunityBundle\\Entity\\Team'
  }),
  configure: (contextType, contextId) => [
    {
      name: 'subject',
      type: 'team',
      label: trans('team', {}, 'community'),
      required: true,
      options: {
        contextType: contextType,
        contextId: contextId
      }
    }
  ]
})
