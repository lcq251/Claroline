import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Tool} from '#/main/core/tool'

import {AgendaEvent} from '#/plugin/agenda/tools/agenda/containers/event'
import {AgendaCalendar} from '#/plugin/agenda/tools/agenda/containers/calendar'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {AgendaList} from '#/plugin/agenda/tools/agenda/components/list'
import {AgendaOverview} from '#/plugin/agenda/tools/agenda/components/overview'

const AgendaTool = (props) =>
  <Tool
    {...props}
    styles={['claroline-distribution-plugin-agenda-agenda']}
    menu={[
      {
        name: 'overview',
        type: LINK_BUTTON,
        label: trans('about'),
        target: props.path,
        exact: true
      }, {
        name: 'calendar',
        type: LINK_BUTTON,
        label: trans('calendar'),
        target: props.path+'/calendar'
      }, {
        name: 'events',
        type: LINK_BUTTON,
        label: trans('all_events', {}, 'agenda'),
        target: props.path+'/events'
      }
    ]}
    pages={[
      {
        path: '/',
        component: AgendaOverview,
        exact: true
      }, {
        path: '/calendar',
        component: AgendaCalendar
      }, {
        path: '/events',
        component: AgendaList,
        exact: true
      }, {
        path: '/events/:id',
        onEnter: (params = {}) => props.loadEvent(params.id),
        component: AgendaEvent
      }
    ]}
  />

AgendaTool.propTypes = {
  loadEvent: T.func.isRequired
}

export {
  AgendaTool
}
