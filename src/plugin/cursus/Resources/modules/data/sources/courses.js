import React from 'react'
import {trans} from '#/main/app/intl/translation'

import {param} from '#/main/app/config'
import {CourseCard} from '#/plugin/cursus/course/components/card'
import {DataMicro} from '#/main/app/data/components/micro'
import {getDefaultAction, getActions} from '#/plugin/cursus/course/utils'

export default (contextType, contextData, refresher, currentUser) => ({
  primaryAction: (course) => getDefaultAction(course, refresher, null, currentUser),
  actions: (courses) => getActions(courses, refresher, null, currentUser),
  definition: [
    {
      name: 'name',
      type: 'string',
      label: trans('name'),
      displayed: true,
      primary: true,
      render: (course) => <DataMicro object={course} />
    }, {
      name: 'code',
      type: 'string',
      label: trans('code'),
      displayed: true
    }, {
      name: 'meta.duration',
      type: 'number',
      label: trans('duration'),
      options: {
        unit: trans('days')
      },
      displayed: true
    }, {
      name: 'location',
      type: 'location',
      label: trans('location'),
      placeholder: trans('online_session', {}, 'cursus'),
      displayable: false,
      sortable: false,
      options: {multiple: false}
    }, {
      name: 'tags',
      type: 'tag',
      label: trans('tags'),
      displayed: true,
      sortable: false,
      options: {
        objectClass: 'Claroline\\CursusBundle\\Entity\\Course'
      }
    }, {
      name: 'pricing.price',
      alias: 'price',
      label: trans('price'),
      type: 'currency',
      displayable: param('pricing.enabled'),
      filterable: false,
      sortable: param('pricing.enabled')
    }, {
      name: 'display.order',
      alias: 'order',
      type: 'number',
      label: trans('order'),
      displayable: false,
      filterable: false
    }
  ],
  card: CourseCard
})
