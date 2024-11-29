import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'

import {SessionCard} from '#/plugin/cursus/session/components/card'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {EventStatus} from '#/plugin/cursus/components/event-status'

const SessionsModal = (props) =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-calendar-week"
    name="trainingSessionsPicker"
    definition={[
      {
        name: 'status',
        type: 'choice',
        label: trans('status'),
        displayed: true,
        order: 1,
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
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true
      }, {
        name: 'code',
        type: 'string',
        label: trans('code'),
        displayed: true
      }, {
        name: 'location',
        type: 'location',
        label: trans('location'),
        placeholder: trans('online_session', {}, 'cursus'),
        displayed: true,
        options: {multiple: false}
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
      }
    ]}
    card={SessionCard}
  />

SessionsModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool,
  // from modal
  fadeModal: T.func.isRequired
}

SessionsModal.defaultProps = {
  url: ['apiv2_cursus_session_list'],
  title: trans('training_sessions', {}, 'cursus')
}

export {
  SessionsModal
}
