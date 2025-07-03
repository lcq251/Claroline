import React, {useMemo} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'
import omit from 'lodash/omit'
import merge from 'lodash/merge'

import {param} from '#/main/app/config'
import {trans} from '#/main/app/intl/translation'
import {ListData, actions as listActions, constants as listConst} from '#/main/app/content/list'
import {selectors as securitySelectors} from '#/main/app/security'

import {SessionCard} from '#/plugin/cursus/session/components/card'
import {EventStatus} from '#/plugin/cursus/components/event-status'
import {getActions, getDefaultAction} from '#/plugin/cursus/session/utils'

const SessionList = (props) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(securitySelectors.currentUser)

  const refresher = useMemo(() => merge({
    add:    () => dispatch(listActions.invalidateData(props.name)),
    update: () => dispatch(listActions.invalidateData(props.name)),
    delete: () => dispatch(listActions.invalidateData(props.name))
  }, props.refresher || {}), [props.path])

  return (
    <ListData
      primaryAction={(row) => getDefaultAction(row, refresher, props.path, currentUser)}
      actions={(rows) => getActions(rows, refresher, props.path, currentUser).then((actions) => [].concat(actions, props.customActions(rows)))}
      definition={[
        {
          name: 'status',
          type: 'choice',
          label: trans('status'),
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
              startDate={get(row, 'dates[0]')}
              endDate={get(row, 'dates[1]')}
            />
        }, {
          name: 'code',
          type: 'string',
          label: trans('code'),
          sortable: false,
          filterable: false
        }, {
          name: 'dates[0]',
          alias: 'startDate',
          type: 'date',
          label: trans('start_date'),
          displayed: true
        }, {
          name: 'dates[1]',
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
          options: {multiple: true},
          filterable: false
        }, {
          name: 'availableSeats',
          type: 'number',
          label: trans('available_seats', {}, 'cursus'),
          displayed: true,
          filterable: false,
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
          name: 'capacity',
          type: 'choice',
          label: trans('available_seats', {}, 'cursus'),
          options: {
            choices: {
              available_seats: trans('available_seats', {}, 'cursus'),
              full: trans('full', {}, 'cursus'),
              missing_seats: trans('missing_seats', {}, 'cursus')
            }
          },
          displayable: false,
          sortable: false,
          filterable: true
        }, {
          name: 'restrictions.hidden',
          label: trans('hidden'),
          type: 'boolean',
          alias: 'hidden',
          filterable: true,
          sortable: false,
          displayable: false
        }
      ].concat(props.customDefinition || [])}
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
  )
}

SessionList.propTypes = {
  path: T.string.isRequired,
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]).isRequired,
  autoload: T.bool,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  })),
  customActions: T.func
}

SessionList.defaultProps = {
  autoload: true,
  customActions: () => []
}

export {
  SessionList
}
