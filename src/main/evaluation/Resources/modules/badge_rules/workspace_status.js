import {createElement} from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {declareBadgeRule} from '#/plugin/open-badge/badge-rule'

import {constants} from '#/main/evaluation/constants'
import {route} from '#/main/core/workspace'

export default declareBadgeRule({
  name: 'workspace_status',
  meta: {
    label: trans('workspace_status', {}, 'badge')
  },
  render: (rule) => createElement(Html, {
    children: trans('workspace_status_desc', {
      status: `<b>${constants.EVALUATION_STATUSES_SHORT[get(rule, 'data.value')]}</b>`,
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
      type: 'choice',
      label: trans('status'),
      required: true,
      options: {
        choices: Object.keys(constants.EVALUATION_STATUSES_SHORT)
          .filter(status => ![constants.EVALUATION_STATUS_UNKNOWN, constants.EVALUATION_STATUS_NOT_ATTEMPTED].includes(status))
          .reduce((acc, current) => Object.assign(acc, {
            [current]: constants.EVALUATION_STATUSES_SHORT[current]
          }), {})
      }
    }
  ]
})
