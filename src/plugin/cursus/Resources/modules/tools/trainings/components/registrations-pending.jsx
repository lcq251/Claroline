import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {PageSection} from '#/main/app/page'
import {displayDateRange, trans} from '#/main/app/intl'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {Badge} from '#/main/app/components/badge'

import {selectors} from '#/plugin/cursus/tools/trainings/store'

/**
 * The list of pending registrations to be validated by a manager or waiting for a session.
 */
const TrainingsRegistrationsPending = () => {
  const pendingRegistrations = useSelector(selectors.myPendingRegistrations)

  if (isEmpty(pendingRegistrations)) {
    return null
  }

  return (
    <PageSection
      className="mb-5"
      title={trans('my_pending_registrations', {}, 'cursus')}
      description={trans('my_pending_registrations_desc', {}, 'cursus')}
    >
      <ul className="list-group mb-0">
        {pendingRegistrations.map(registration =>
          <li key={registration.id} className="list-group-item d-flex flex-row gap-3 flex-wrap align-items-center">
            <Thumbnail
              thumbnail={registration.course.thumbnail}
              name={registration.course.name}
              size="sm"
              square={true}
            />
            <div className="flex-fill">
              <h3 className="fs-base mb-2">{registration.course.name}</h3>
              <p className="text-body-secondary mb-0 fs-sm">
                {registration.session ?
                  displayDateRange(get(registration.session, 'dates[0]'), get(registration.session, 'dates[1]')) :
                  trans('no_session', {}, 'cursus')
                }
              </p>
            </div>

            <Badge className="ms-auto fs-base lh-base fw-normal" variant="warning" subtle={true}>
              {trans(!registration.session ? 'pending_session' : 'pending_validation', {}, 'cursus')}
            </Badge>
          </li>
        )}
      </ul>
    </PageSection>
  )
}

export {
  TrainingsRegistrationsPending
}
