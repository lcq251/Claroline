import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {displayDateRange, trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {Badge} from '#/main/app/components/badge'
import {Contact} from '#/main/app/components/contact'
import {PageContent, PageSection} from '#/main/app/page'
import {PageHeading} from '#/main/app/page/components/heading'

import {Event as EventTypes} from '#/plugin/agenda/prop-types'
import {route} from '#/plugin/agenda/tools/agenda/routing'
import {MODAL_EVENT_PARAMETERS} from '#/plugin/agenda/event/modals/parameters'
import {CalendarIcon} from '#/main/app/calendar/components/icon'
import {Content} from '#/main/app/components/content'

const EventPage = (props) => {
  return (
    <ToolPage
      className="event-page"
      title={props.event.name}
      description={get(props.event, 'description')}
    >
      {!isEmpty(props.event) &&
        <PageContent>
          <PageHeading
            size="md"
            icon={
              <CalendarIcon square={true} size="lg" date={props.event.date} />
            }
            poster={get(props.event, 'thumbnail')}
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

          <PageSection size="md" className="mb-5">
            <Content
              meta={
                <>
                  {displayDateRange(get(props.event, 'start'), get(props.event, 'end'), true)}

                  <Badge variant="secondary" subtle={true} className="ms-auto fs-sm lh-base">
                    {trans(props.event.meta.type, {}, 'event')}
                  </Badge>
                </>
              }
            >
              {props.event.description}
            </Content>

            {props.event.locationUrl &&
              <div className="d-flex flex-row align-items-baseline mt-4" role="presentation">
                <span className="fa fa-fw fa-link me-2" aria-hidden={true} />
                <a href={props.event.locationUrl} className="text-reset">
                  {props.event.locationUrl}
                </a>
              </div>
            }

            {props.event.location &&
              <Contact {...props.event.location} className="mt-4 mb-0" />
            }
          </PageSection>

          {props.children}
        </PageContent>
      }
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
