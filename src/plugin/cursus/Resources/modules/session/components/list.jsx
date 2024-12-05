import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {url} from '#/main/app/api'
import {param} from '#/main/app/config'
import {hasPermission} from '#/main/app/security'
import {trans, transChoice} from '#/main/app/intl/translation'
import {ListData} from '#/main/app/content/list/containers/data'
import {ASYNC_BUTTON, LINK_BUTTON, MODAL_BUTTON, URL_BUTTON} from '#/main/app/buttons'
import {constants as listConst} from '#/main/app/content/list'

import {SessionCard} from '#/plugin/cursus/session/components/card'
import {EventStatus} from '#/plugin/cursus/components/event-status'
import {MODAL_SESSION_CANCEL} from '#/plugin/cursus/session/modals/cancel'
import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/parameters'
import {route} from '#/plugin/cursus/session/routing'

const SessionList = (props) =>
  <ListData
    primaryAction={(row) => ({
      type: LINK_BUTTON,
      target: route(row, props.path),
      label: trans('open', {}, 'actions')
    })}
    definition={[
      {
        name: 'status',
        type: 'choice',
        label: trans('status'),
        // displayed: true,
        // order: 1,
        options: {
          noEmpty: true,
          choices: {
            not_started: trans('session_not_started', {}, 'cursus'),
            in_progress: trans('session_in_progress', {}, 'cursus'),
            ended: trans('session_ended', {}, 'cursus'),
            not_ended: trans('session_not_ended', {}, 'cursus')
          }
        },
        render: (row) =>
          <EventStatus
            startDate={get(row, 'restrictions.dates[0]')}
            endDate={get(row, 'restrictions.dates[1]')}
          />
      }, {
        name: 'code',
        type: 'string',
        label: trans('code'),
        sortable: false,
        filterable: false
      }, {
        name: 'restrictions.dates[0]',
        alias: 'startDate',
        type: 'date',
        label: trans('start_date'),
        displayed: true
      }, {
        name: 'restrictions.dates[1]',
        alias: 'endDate',
        type: 'date',
        label: trans('end_date'),
        displayed: true
      }, {
        name: 'location',
        type: 'location',
        label: trans('location'),
        placeholder: trans('online_session', {}, 'cursus'),
        options: {multiple: false}
      }, {
        name: 'pricing.price',
        alias: 'price',
        label: trans('price'),
        type: 'currency',
        displayable: param('pricing.enabled'),
        filterable: false,
        sortable: param('pricing.enabled')
      }, {
        name: 'tutors',
        type: 'user',
        label: trans('tutors', {}, 'cursus'),
        options: {multiple: true}
      }, {
        name: 'availableSeats',
        type: 'number',
        label: trans('available_seats', {}, 'cursus'),
        displayed: true,
        filterable: true,
        sortable: false,
        render: (row) => {
          if (get(row, 'restrictions.users')) {
            return (get(row, 'restrictions.users') - get(row, 'participants.learners', 0)) + ' / ' + get(row, 'restrictions.users')
          }

          return (
            <>
              <span className="visually-hidden">{trans('not_limited', {}, 'cursus')}</span>
              <span className="fa fa-infinity" aria-hidden={true} />
            </>
          )
        }
      }, {
        name: 'restrictions.hidden',
        label: trans('hidden'),
        type: 'boolean',
        alias: 'hidden',
        displayable: false
      }
    ].concat(props.customDefinition)}
    actions={(rows) => [
      {
        name: 'edit',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit', {}, 'actions'),
        modal: [MODAL_SESSION_FORM, {
          session: rows[0],
          onSave: () => props.reload(props.course.slug)
        }],
        scope: ['object'],
        displayed: hasPermission('edit', rows[0]),
        group: trans('management')
      }, {
        name: 'export-pdf',
        type: URL_BUTTON,
        icon: 'fa fa-fw fa-file-pdf',
        label: trans('export-pdf', {}, 'actions'),
        displayed: hasPermission('open', rows[0]),
        group: trans('transfer'),
        target: ['apiv2_cursus_session_download_pdf', {id: rows[0].id}],
        scope: ['object']
      }, {
        name: 'copy',
        type: ASYNC_BUTTON,
        icon: 'fa fa-fw fa-clone',
        label: trans('copy', {}, 'actions'),
        displayed: hasPermission('edit', rows[0]),
        confirm: {
          title: transChoice('copy_session_confirm_title', rows.length, {}, 'actions'),
          subtitle: 1 === rows.length ? rows[0].name : transChoice('count_elements', rows.length, {count: rows.length}),
          message: transChoice('copy_session_confirm_message', rows.length, {count: rows.length}, 'actions')
        },
        request: {
          url: url(['apiv2_cursus_session_copy']),
          request: {
            method: 'POST',
            body: JSON.stringify({
              ids: rows.map(row => row.id)
            })
          }
        },
        group: trans('management'),
        scope: ['object', 'collection']
      }, {
        name: 'cancel',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-ban',
        label: trans('cancel', {}, 'actions'),
        displayed: hasPermission('edit', rows[0]),
        group: trans('management'),
        scope: ['object', 'collection'],
        modal: [MODAL_SESSION_CANCEL, {
          sessions: rows
        }],
        dangerous: true
      }
    ].concat(props.customActions ? props.customActions(rows) : [])}
    display={{
      current: listConst.DISPLAY_LIST
    }}
    card={SessionCard}

    {...omit(props, 'path', 'url', 'autoload', 'customDefinition', 'customActions')}

    name={props.name}
    fetch={{
      url: props.url,
      autoload: props.autoload
    }}
  />

SessionList.propTypes = {
  path: T.string.isRequired,
  name: T.string.isRequired,
  autoload: T.bool,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  })),
  customActions: T.func
}

SessionList.defaultProps = {
  autoload: true,
  customDefinition: [],
  customActions: () => []
}

export {
  SessionList
}
