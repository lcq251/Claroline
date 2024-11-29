import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {currency, displayDateRange, trans} from '#/main/app/intl'
import {Toolbar} from '#/main/app/action'
import {Badge} from '#/main/app/components/badge'
import {Text} from '#/main/app/components/text'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'

import {getInfo} from '#/plugin/cursus/utils'
import {Address} from '#/main/app/components/address'
import isEmpty from 'lodash/isEmpty'
import {toKey} from '#/main/app/utils/text'
import isNumber from 'lodash/isNumber'

const SessionInfo = (props) => {
  if (isEmpty(props.info)) {
    return null
  }

  return (
    <ul className="list-group list-group-striped list-group-flush">
      {props.info
        .sort((a, b) => {
          if (isNumber(a.order) && !isNumber(b.order)) {
            return -1
          } else if (!isNumber(a.order) && isNumber(b.order)) {
            return 1
          } else if (isNumber(a.order) && isNumber(b.order)) {
            return a.order - b.order
          }

          return 0
        })
        .map(info =>
          <li key={toKey(info.label)} className="list-group-item d-flex align-items-baseline text-body-secondary fs-sm px-4">
            {info.icon &&
              <span className={classes('fa-fw me-3', info.icon)} aria-hidden={true} />
            }

            <div className="" role="presentation">
              <b className="text-uppercase d-block fs-sm mb-1 text-nowrap">{info.label}</b>
              {info.value}
            </div>
          </li>
        )
      }
    </ul>
  )
}

const CourseAffix = (props) => {
  const info = []

  if (props.activeSession) {
    info.push({
      icon: 'fa fa-calendar-week',
      label: trans('training_period', {}, 'cursus'),
      value: displayDateRange(get(props.activeSession, 'restrictions.dates[0]'), get(props.activeSession, 'restrictions.dates[1]')),
      order: 1
    })
    info.push({
      icon: 'fa fa-map-marker-alt',
      label: trans('location'),
      value: get(props.activeSession, 'location') ?
        <Address
          name={get(props.activeSession.location, 'name')}
          {...get(props.activeSession.location, 'address')}
        /> :
        trans('online_session', {}, 'cursus'),
      order: 4
    })
  }

  if (get(props.course, 'meta.duration')) {
    info.push({
      icon: 'fa fa-clock',
      label: trans('training_duration', {}, 'cursus'),
      value: get(props.course, 'meta.duration') + ' ' + trans('hours'),
      order: 2
    })
  }

  if (getInfo(props.course, props.activeSession, 'pricing.price')
    || 0 === getInfo(props.course, props.activeSession, 'pricing.price')
    || getInfo(props.course, props.activeSession, 'pricing.description')
  ) {
    info.push({
      icon: 'fa fa-credit-card',
      label: trans('price'),
      value: (
        <>
          {(getInfo(props.course, props.activeSession, 'pricing.price') || 0 === getInfo(props.course, props.activeSession, 'pricing.price')) &&
            currency(getInfo(props.course, props.activeSession, 'pricing.price'))
          }

          {getInfo(props.course, props.activeSession, 'pricing.description') &&
            <Text className="mb-0" nl2br={true}>{getInfo(props.course, props.activeSession, 'pricing.description') || ''}</Text>
          }
        </>
      ),
      order: 3
    })
  }

  return (
    <div className="card shadow">
      <div className="p-4" role="presentation">
        {!props.registered && props.sessionFull &&
          <Badge
            variant="warning"
            subtle={true}
            className="fs-base lh-base mb-2 d-block w-100 py-2 px-3"
          >
            {trans('full', {}, 'cursus')}
          </Badge>
        }

        {props.registered &&
          <Badge
            variant="success"
            subtle={true}
            className="fs-base lh-base mb-2 d-block w-100 py-2 px-3"
          >
            {trans('registered')}
          </Badge>
        }

        <Toolbar
          className="d-grid gap-1"
          buttonName="btn"
          primaryName="btn-primary"
          defaultName="btn-link"
          actions={props.actions}
        />
      </div>

      <SessionInfo info={info} />
    </div>
  )
}

CourseAffix.propTypes = {
  sessionFull: T.bool,
  registered: T.bool,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  actions: T.array
}

export {
  CourseAffix
}
