import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Routes} from '#/main/app/router'

import {EventsList} from '#/plugin/cursus/tools/trainings/event/components/list'
import {EventsDetails} from '#/plugin/cursus/tools/events/containers/details'
import {EventMain as Event} from '#/plugin/cursus/events/event/containers/main'

const EventMain = (props) =>
  <Routes
    path={props.path+'/events'}
    /*redirect={[
      {from: '/', exact: true, to: '/all'}
    ]}*/
    routes={[
      /*{
        path: '/registered',
        onEnter: props.invalidateList,
        disabled: !props.authenticated,
        render: () => (
          <EventsList
            path={props.path+'/events'}
            title={trans('my_events', {}, 'cursus')}
            url={['apiv2_cursus_my_events'/!*, {workspace: props.contextId}*!/]}
          />
        )
      }, */{
        path: '/',
        onEnter: props.invalidateList,
        exact: true,
        render: () => (
          <EventsList
            path={props.path+'/events'}
            title={trans('all_events', {}, 'cursus')}
            url={props.authenticated && (props.canEdit || props.canRegister) ?
              ['apiv2_cursus_event_list'/*, {workspace: props.contextId}*/] :
              ['apiv2_cursus_event_public'/*, {workspace: props.contextId}*/]
            }
          />
        ),
        disabled: !props.authenticated || !props.canEdit || !props.canRegister
      }, {
        path: '/:id',
        render: (routerProps) => (
          <Event eventId={routerProps.match.params.id}>
            <EventsDetails path={props.path+'/events'} />
          </Event>
        )
      }
    ]}
  />

EventMain.propTypes = {
  path: T.string.isRequired,
  authenticated: T.bool.isRequired,
  canEdit: T.bool.isRequired,
  canRegister: T.bool.isRequired,
  invalidateList: T.func.isRequired
}

export {
  EventMain
}