import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'

import {Event as EventTypes} from '#/plugin/cursus/prop-types'
import {EventAbout} from '#/plugin/cursus/event/components/about'
import {EventParticipants} from '#/plugin/cursus/event/containers/participants'
import {PageTabbedSection} from '#/main/app/page'

const EventDetails = (props) =>
  <PageTabbedSection
    path={`${props.path}/${props.event.id}`}
    size="md"
    tabs={[
      {
        path: '',
        exact: true,
        //icon: 'fa fa-user',
        title: trans('about'),
        render: () => (
          <EventAbout
            path={props.path}
            event={props.event}
            registration={props.registration}
            register={props.register}
          />
        )
      }, {
        path: '/participants',
        title: trans('participants'),
        displayed: props.isAuthenticated,
        render: () => (
          <EventParticipants
            path={props.path}
            event={props.event}
          />
        )
      }
    ]}
  />

EventDetails.propTypes = {
  path: T.string.isRequired,
  isAuthenticated: T.bool.isRequired,
  event: T.shape(
    EventTypes.propTypes
  ).isRequired,
  registration: T.object,
  register: T.func.isRequired
}

export {
  EventDetails
}
