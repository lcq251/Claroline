import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {now} from '#/main/app/intl'

function getInfo(course, session, path) {
  if (session && undefined !== get(session, path)) {
    return get(session, path)
  } else if (get(course, path)) {
    return get(course, path)
  }

  return null
}

function getPeriodStatus(startDate, endDate) {
  let status
  if (startDate > now(false)) {
    status = 'not_started'
  } else if (startDate <= now(false) && endDate >= now(false)) {
    status = 'in_progress'
  } else if (endDate < now(false)) {
    status = 'ended'
  }

  return status
}

function isFull(session) {
  if (get(session, 'restrictions.users')) {
    return get(session, 'restrictions.users') <= get(session, 'participants.learners')
  }

  return false
}

function isFullyRegistered(registration) {
  if (registration) {
    if (registration.session) {
      return registration.confirmed && registration.validated
    }

    return true
  }

  return false
}

function getSessionRegistration(session, registrations = []) {
  return registrations.find(registration => registration.session && session.id === registration.session.id)
}

function isRegistered(session, registrations= []) {
  const registration = getSessionRegistration(session, registrations)

  return !isEmpty(registration) && isFullyRegistered(registration)
}

function canSelfRegister(course, session, registrations = []) {
  return getInfo(course, session, 'registration.selfRegistration')
    && !getInfo(course, session, 'registration.autoRegistration')
    && !isRegistered(session, registrations)
    && (getInfo(course, session, 'registration.pendingRegistrations') || !isFull(session))
}

function getAvailableSeats(session) {
  let availableSeats = null
  if (get(session, 'restrictions.users')) {
    availableSeats = (get(session, 'restrictions.users') - get(session, 'participants.learners', 0))
    if (0 > availableSeats) {
      availableSeats = 0
    }
  }

  return availableSeats
}

export {
  getInfo,
  getPeriodStatus,
  isFull,
  getSessionRegistration,
  isFullyRegistered,
  isRegistered,
  canSelfRegister,
  getAvailableSeats
}
