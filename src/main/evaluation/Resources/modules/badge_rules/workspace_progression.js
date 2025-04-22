import get from 'lodash/get'
import {createElement} from 'react'

import {trans} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {declareBadgeRule} from '#/plugin/open-badge/badge-rule'

import {route} from '#/main/core/workspace'

export default declareBadgeRule({
  name: 'workspace_progression',
  meta: {
    label: trans('workspace_progression', {}, 'badge')
  },
  render: (rule) => createElement(Html, {
    children: trans('workspace_progression_desc', {
      progression: `<b>${get(rule, 'data.value', '')}%</b>`,
      workspace: `<a class="fw-bolder text-reset" href="#${route(rule.subject)}">`+get(rule, 'subject.name')+'</a>'
    }, 'badge')
  }),
  default: (rule) => Object.assign({}, rule, {
    subjectClass: 'Claroline\\CoreBundle\\Entity\\Workspace\\Workspace'
  }),
  configure: () => [
    {
      name: 'subject',
      type: 'workspace',
      label: trans('workspace', {}, 'workspace'),
      required: true
    }, {
      name: 'data.value',
      type: 'number',
      label: trans('progression'),
      required: true,
      options: {
        min: 0,
        max: 100,
        unit: '%'
      }
    }
  ]
})
