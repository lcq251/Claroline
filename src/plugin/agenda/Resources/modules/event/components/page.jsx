import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {Badge} from '#/main/app/components/badge'
import {Contact} from '#/main/app/components/contact'
import {Datetime} from '#/main/app/components/date'
import {ContentHtml} from '#/main/app/content/components/html'
import {PageSection} from '#/main/app/page'
import {PageHeading} from '#/main/app/page/components/heading'

import {Event as EventTypes} from '#/plugin/agenda/prop-types'
import {route} from '#/plugin/agenda/tools/agenda/routing'
import {MODAL_EVENT_PARAMETERS} from '#/plugin/agenda/event/modals/parameters'

const EventPage = (props) => {
  const eventDate = moment(props.event.start)

  return (
    <ToolPage
      className="event-page"
      breadcrumb={[
        {
          label: props.event.name,
          target: props.path+'/event/'+props.event.id
        }
      ]}
      title={props.event.name}
      description={get(props.event, 'description')}
      poster={get(props.event, 'thumbnail')}
    >
      {!isEmpty(props.event) &&
        <PageHeading
          size="md"
          icon={
            <div className="event-icon event-icon-xl">
              <div className="event-icon-month p-2">
                {eventDate.format('MMMM')}
              </div>
              <div className="event-icon-day p-2">
                {eventDate.format('D')}
              </div>
              <div className="event-icon-weekday">
                {eventDate.format('dddd')}
              </div>
            </div>
          }
          title={get(props.event, 'name', trans('loading'))}
          actions={[
            {
              name: 'show-calendar',
              type: LINK_BUTTON,
              icon: 'fa fa-fw fa-calendar',
              label: trans('show-calendar', {}, 'actions'),
              target: route(props.path, 'month', props.event.start)
            }, {
              name: 'edit',
              type: MODAL_BUTTON,
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit', {}, 'actions'),
              modal: [MODAL_EVENT_PARAMETERS, {
                event: props.event,
                onSave: props.reload
              }],
              displayed: hasPermission('edit', props.event)
            }, {
              name: 'delete',
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-trash',
              label: trans('delete', {}, 'actions'),
              callback: () => props.delete(props.event).then(() => {
                props.reload(props.event)
                props.history.push(route(props.path, 'month', props.event.start))
              }),
              dangerous: true,
              displayed: hasPermission('delete', props.event)
            }
          ].concat(props.actions)}
        />
      }

      <PageSection size="md" className="mb-4">
        <div className="text-body-tertiary d-flex align-items-center gap-3 mb-4" role="presentation">
          <Datetime value={get(props.event, 'start')} long={true} time={true} />

          <span>-</span>

          <Datetime value={get(props.event, 'end')} long={true} time={true} />

          <Badge variant="secondary" subtle={true} className="ms-auto fs-sm lh-base">
            {trans(props.event.meta.type, {}, 'event')}
          </Badge>
        </div>

        {props.event.description &&
          <ContentHtml className="lead mb-4">{props.event.description}</ContentHtml>
        }

        {props.event.locationUrl &&
          <div className="d-flex flex-row align-items-baseline mb-2 mb-4" role="presentation">
            <span className="fa fa-fw fa-link me-2" aria-hidden={true} />
            <a href={props.event.locationUrl} className="text-reset">
              {props.event.locationUrl}
            </a>
          </div>
        }

        {props.event.location &&
          <Contact {...props.event.location} className="mb-4" />
        }
      </PageSection>

      {props.children}
    </ToolPage>
  )
}

EventPage.propTypes = {
  event: T.shape(
    EventTypes.propTypes
  ).isRequired,
  reload: T.func.isRequired,
  actions: T.arrayOf(T.object),
  children: T.node,
  // from store
  path: T.string.isRequired,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  delete: T.func.isRequired
}

EventPage.defaultProps = {
  actions: []
}

export {
  EventPage
}
