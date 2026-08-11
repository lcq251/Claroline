/*
 * Relative time formatting for the dashboard notifications widget (C-22).
 * Translation keys live in the widget domain (dashboard_time_*).
 */

import {trans} from '#/main/app/intl/translation'

function relativeTime(iso) {
  if (!iso) {
    return null
  }

  const then = new Date(iso).getTime()
  if (isNaN(then)) {
    return null
  }

  const diff = Math.max(0, Date.now() - then)
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) {
    return trans('dashboard_time_just_now', {}, 'widget')
  }

  if (minutes < 60) {
    return trans('dashboard_time_minutes', {n: minutes}, 'widget')
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return trans('dashboard_time_hours', {n: hours}, 'widget')
  }

  const days = Math.floor(hours / 24)

  if (days < 2) {
    return trans('dashboard_time_yesterday', {}, 'widget')
  }

  return trans('dashboard_time_days', {n: days}, 'widget')
}

export {
  relativeTime
}
