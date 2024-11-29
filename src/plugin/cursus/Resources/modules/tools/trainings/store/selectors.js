import get from 'lodash/get'
import {createSelector} from 'reselect'

import {isFullyRegistered} from '#/plugin/cursus/utils'

const STORE_NAME = 'trainings'

const store = (state) => state[STORE_NAME]

const parameters = createSelector(
  [store],
  (store) => store.parameters
)

const registrations = createSelector(
  [store],
  (store) => store.registrations
)

const mySessions = createSelector(
  [registrations],
  (registrations) => {
    // only get fully registered sessions
    let sessionRegistrations = registrations.filter(ur => isFullyRegistered(ur))

    return sessionRegistrations
      .map(sessionRegistration => Object.assign({
        workspace: sessionRegistration.workspace
      }, sessionRegistration.session))
      .sort((a, b) => {
        if (get(a, 'restrictions.dates[0]') > get(b, 'restrictions.dates[0]')) {
          return 1
        } else if (get(a, 'restrictions.dates[0]') < get(b, 'restrictions.dates[0]')) {
          return -1
        }

        return 0
      })
  }
)

const myPendingRegistrations = createSelector(
  [registrations],
  (registrations) => {

  }
)

export const selectors = {
  STORE_NAME,
  store,
  parameters,
  mySessions
}
