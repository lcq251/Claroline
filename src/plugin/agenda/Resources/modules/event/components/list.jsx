import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {ListData} from '#/main/app/content/list/containers/data'

import {EventCard} from '#/plugin/agenda/event/components/card'
import {EventIcon} from '#/plugin/agenda/event/components/icon'

const EventList = (props) =>
  <ListData
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true,
        render: (event) => (
          <div className="d-flex flex-direction-row gap-3 align-items-center" role="presentation">
            <EventIcon type={event.meta.type} />
            {event.name}
          </div>
        )
      }, /*{
        name: 'meta.type',
        type: 'type',
        label: trans('type'),
        displayed: true,
        calculated: (event) => ({
          icon: <EventIcon type={event.meta.type} />,
          name: trans(event.meta.type, {}, 'event'),
          description: trans(`${event.meta.type}_desc`, {}, 'event')
        })
      }, */{
        name: 'description',
        type: 'html',
        label: trans('description'),
        displayed: true
      }, {
        name: 'start',
        type: 'date',
        alias: 'startDate',
        label: trans('start_date'),
        displayed: true,
        options: {time: true}
      }, {
        name: 'end',
        type: 'date',
        alias: 'endDate',
        label: trans('end_date'),
        displayed: true,
        options: {time: true}
      }
    ].concat(props.customDefinition)}
    {...omit(props, 'url', 'autoload', 'customDefinition')}

    name={props.name}
    fetch={{
      url: props.url,
      autoload: props.autoload
    }}
    card={EventCard}
  />

EventList.propTypes = {
  name: T.string.isRequired,
  autoload: T.bool,
  url: T.oneOfType([T.string, T.array]).isRequired,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  }))
}

EventList.defaultProps = {
  autoload: true,
  customDefinition: []
}

export {
  EventList
}
