import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {MODAL_BUTTON, URL_BUTTON, ASYNC_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'

import {Event as EventTypes} from '#/plugin/cursus/prop-types'
import {MODAL_TRAINING_EVENT_FORM} from '#/plugin/cursus/event/modals/form'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {displayDateRange} from '#/main/app/intl'
import {Contact} from '#/main/app/components/contact'
import {PageContent, PageSection, PageToolbar, PageToolbarSkeleton} from '#/main/app/page'
import {EventStatus} from '#/plugin/cursus/components/event-status'
import {CalendarIcon} from '#/main/app/calendar/components/icon'
import {Content} from '#/main/app/components/content'

const EventPage = (props) => {
  return (
    <ToolPage
      className="event-page"
      title={get(props.event, 'name')}
      description={props.event.description}
    >
      {isEmpty(props.event) &&
        <PageContent className="placeholder-glow">
          <PageToolbarSkeleton toolbar="edit more" />
          <PageHeadingSkeleton icon={true} />
        </PageContent>
      }

      {!isEmpty(props.event) &&
        <PageContent poster={get(props.event, 'poster')}>
          <PageToolbar
            toolbar="edit more"
            actions={[
              {
                name: 'edit',
                type: MODAL_BUTTON,
                icon: 'fa fa-fw fa-pencil',
                label: trans('edit', {}, 'actions'),
                modal: [MODAL_TRAINING_EVENT_FORM, {
                  event: props.event,
                  onSave: () => props.reload(props.event.id)
                }],
                group: trans('management'),
                displayed: hasPermission('edit', props.event),
                primary: true
              }, {
                name: 'export-pdf',
                type: URL_BUTTON,
                icon: 'fa fa-fw fa-file-pdf',
                label: trans('export-pdf', {}, 'actions'),
                displayed: hasPermission('open', props.event),
                group: trans('transfer'),
                target: ['apiv2_cursus_event_download_pdf', {id: props.event.id}]
              }, {
                name: 'export-ics',
                type: URL_BUTTON,
                icon: 'fa fa-fw fa-calendar',
                label: trans('export-ics', {}, 'actions'),
                displayed: hasPermission('open', props.event),
                group: trans('transfer'),
                target: ['apiv2_cursus_event_download_ics', {id: props.event.id}]
              }, {
                name: 'export-presences-empty',
                type: URL_BUTTON,
                icon: 'fa fa-fw fa-border-none',
                label: trans('export-presences-empty', {}, 'cursus'),
                displayed: hasPermission('edit', props.event),
                group: trans('presences', {}, 'cursus'),
                target: ['apiv2_cursus_event_presence_download', {id: props.event.id, filled: 0}]
              }, {
                name: 'export-presences-filled',
                type: URL_BUTTON,
                icon: 'fa fa-fw fa-border-all',
                label: trans('export-presences-filled', {}, 'cursus'),
                displayed: hasPermission('edit', props.event),
                group: trans('presences', {}, 'cursus'),
                target: ['apiv2_cursus_event_presence_download', {id: props.event.id, filled: 1}]
              }, {
                name: 'confirm-status',
                type: ASYNC_BUTTON,
                icon: 'fa fa-fw fa-clipboard-check',
                label: trans('presence_validation', {}, 'presence'),
                displayed: hasPermission('edit', props.event),
                group: trans('presences', {}, 'cursus'),
                request: {
                  url: ['apiv2_cursus_event_presence_confirm', {id: props.event.id}],
                  request: {
                    method: 'PUT'
                  }
                }
              }
            ]}
          />
          <PageHeading
            icon={
              <CalendarIcon square={true} size="lg" date={props.event.date} />
            }
            title={get(props.event, 'name', trans('loading'))}
          />

          <PageSection className="mb-5">
            <Content
              meta={
                <>
                  {displayDateRange(get(props.event, 'start'), get(props.event, 'end'), true)}

                  <EventStatus
                    className="ms-auto fs-sm lh-base"
                    startDate={get(props.event, 'start')}
                    endDate={get(props.event, 'end')}
                    subtle={true}
                  >
                    {trans(props.event.meta.type, {}, 'event')}
                  </EventStatus>
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
  path: T.array,
  basePath: T.string.isRequired,
  primaryAction: T.string,
  actions: T.array,
  event: T.shape(
    EventTypes.propTypes
  ),
  reload: T.func.isRequired,
  children: T.any
}

EventPage.defaultProps = {
  path: []
}

export {
  EventPage
}
