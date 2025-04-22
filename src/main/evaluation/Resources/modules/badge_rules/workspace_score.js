import {createElement} from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {declareBadgeRule} from '#/plugin/open-badge/badge-rule'

import {route} from '#/main/core/workspace'

export default declareBadgeRule({
  name: 'workspace_score',
  meta: {
    label: trans('workspace_score', {}, 'badge')
  },
  render: (rule) => createElement(Html, {
    children: trans(`workspace_score_${get(rule, 'data.comparator', 'gte')}_desc`, {
      min: `<b>${get(rule, 'data.min', '')}%</b>`,
      max: `<b>${get(rule, 'data.max', '')}%</b>`,
      score: `<b>${get(rule, 'data.value', '')}%</b>`,
      workspace: `<a class="fw-bolder text-reset" href="#${route(rule.subject)}">`+get(rule, 'subject.name')+'</a>'
    }, 'badge')
  }),
  default: (rule) => Object.assign({}, rule, {
    data: {comparator: 'gte'},
    subjectClass: 'Claroline\\CoreBundle\\Entity\\Workspace\\Workspace'
  }),
  configure: () => [
    {
      name: 'subject',
      type: 'workspace',
      label: trans('workspace', {}, 'workspace'),
      required: true
    }, {
      name: 'data.comparator',
      type: 'choice',
      label: trans('comparator'),
      required: true,
      hideLabel: true,
      options: {
        choices: {
          gte: trans('Supérieur ou égal à'),
          lte: trans('Inférieur ou égal à'),
          equal: trans('Égal à'),
          between: trans('Compris entre')
        }
      }
    }, {
      name: 'data.value',
      type: 'number',
      label: trans('score', {}, 'evaluation'),
      displayed: (formData) => 'between' !== get(formData, 'data.comparator'),
      required: true,
      options: {
        min: 0,
        max: 100,
        unit: '%'
      }
    }, {
      name: 'data.min',
      type: 'number',
      label: trans('score_min', {}, 'evaluation'),
      displayed: (formData) => 'between' === get(formData, 'data.comparator'),
      required: true,
      options: {
        min: 0,
        max: 100,
        unit: '%'
      }
    }, {
      name: 'data.max',
      type: 'number',
      label: trans('score_max', {}, 'evaluation'),
      displayed: (formData) => 'between' === get(formData, 'data.comparator'),
      required: true,
      options: {
        min: 0,
        max: 100,
        unit: '%'
      }
    }
  ]
})
