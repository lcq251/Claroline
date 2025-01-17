import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {currency, displayDateRange, trans} from '#/main/app/intl'
import {Badge} from '#/main/app/components/badge'
import {Text} from '#/main/app/components/text'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'

import {getInfo} from '#/plugin/cursus/utils'
import {Address} from '#/main/app/components/address'
import {PageAffixCard} from '#/main/app/page/components/affix'

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
    <PageAffixCard
      actions={props.actions}
      info={info}
    >
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
    </PageAffixCard>
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
