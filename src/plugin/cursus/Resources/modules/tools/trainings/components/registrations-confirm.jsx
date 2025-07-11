import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {PageSection} from '#/main/app/page'
import {displayDateRange, trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {Thumbnail} from '#/main/app/components/thumbnail'

import {actions, selectors} from '#/plugin/cursus/tools/trainings/store'
import confirmAction from '#/plugin/cursus/actions/session_registration/confirm'

/**
 * The list of pending registrations to be confirmed by the user
 */
const TrainingsRegistrationsConfirm = () => {
  const dispatch = useDispatch()

  const pendingRegistrations = useSelector(selectors.myRegistrationsToConfirm)
  if (isEmpty(pendingRegistrations)) {
    return null
  }

  return (
    <PageSection
      className="mb-5"
      title={trans('my_registrations_to_confirm', {}, 'cursus')}
      description={trans('my_registrations_to_confirm_desc', {}, 'cursus')}
    >
      <ul className="list-group mb-0">
        {pendingRegistrations.map(registration =>
          <li key={registration.id} className="list-group-item d-flex flex-row gap-3 flex-wrap align-items-center">
            <Thumbnail
              thumbnail={registration.course.poster}
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

            <Button
              className="btn btn-primary ms-auto"
              {...confirmAction([registration], {
                update: (registrations) => dispatch(actions.updateRegistrations(registrations[0]))
              })}
              icon={undefined}
              label={trans('confirm', {}, 'actions')}
            />
          </li>
        )}
      </ul>
    </PageSection>
  )
}

TrainingsRegistrationsConfirm.propTypes = {
  path: T.string.isRequired,
  contextType: T.string.isRequired
}

export {
  TrainingsRegistrationsConfirm
}
