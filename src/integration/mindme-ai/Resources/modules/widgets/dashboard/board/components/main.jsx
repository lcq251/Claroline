/*
 * dashboard-board widget (C-22): role-based metric board.
 *
 * Frontend does ZERO role branching (D9b): the backend fills only the stats
 * group matching the current user's role (teacher | student | both null).
 * This component renders the non-null group or the "shared area only" empty
 * state (`showEmptyHint` controls visibility).
 */

import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {locale} from '#/main/app/intl'
import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'
import {useCurrentUser} from '#/main/app/security/hooks/useCurrentUser'

import {getIcon} from '../common/icons'

// className prefix used by dashboard.scss (PREFIX + '-' + widget name)
const PREFIX = 'claroline-distribution-integration-mindme-ai-dashboard-dashboard-board'

// hardcoded unit mapping (spec §3.1): GB / % are language-neutral, the
// Chinese measure words (个/门/人/枚) only appear in the zh UI
const zh = 'zh' === locale()
const UNITS = {
  gb: 'GB',
  pct: '%',
  count: zh ? '个' : '',
  courses: zh ? '门' : '',
  people: zh ? '人' : '',
  badges: zh ? '枚' : ''
}

// teacher 6 metrics (spec §1.5.2)
function teacherCards(stats) {
  const used = stats.storage_used
  const total = stats.storage_total
  const usage = (null != used && null != total && total > 0) ? Math.round(used / total * 100) : null

  return [
    {
      icon: getIcon('stat-storage'),
      label: 'dashboard_metric_storage_total',
      en: 'Storage',
      unit: UNITS.gb,
      value: stats.storage_total,
      sub: trans('dashboard_metric_storage_total_sub', {}, 'widget'),
      na: null == stats.storage_total
    },
    {
      icon: getIcon('stat-usage'),
      label: 'dashboard_metric_storage_usage',
      en: 'Usage',
      unit: UNITS.pct,
      value: usage,
      bar: usage,
      sub: (null != used && null != total)
        ? trans('dashboard_metric_storage_usage_sub', {used: used, total: total}, 'widget')
        : trans('dashboard_metric_na', {}, 'widget'),
      na: null == usage
    },
    {
      icon: getIcon('stat-resources'),
      label: 'dashboard_metric_resources',
      en: 'Resources',
      unit: UNITS.count,
      value: stats.resources,
      sub: trans('dashboard_metric_resources_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-apps'),
      label: 'dashboard_metric_apps',
      en: 'Apps',
      unit: UNITS.count,
      value: stats.apps,
      sub: trans('dashboard_metric_apps_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-courses'),
      label: 'dashboard_metric_courses',
      en: 'Courses',
      unit: UNITS.courses,
      value: stats.courses,
      sub: trans('dashboard_metric_courses_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-registrations'),
      label: 'dashboard_metric_registrations',
      en: 'Enrollments',
      unit: UNITS.people,
      value: stats.registrations,
      sub: trans('dashboard_metric_registrations_sub', {}, 'widget'),
      na: false
    }
  ]
}

// student 6 metrics (spec §1.5.3)
function studentCards(stats) {
  return [
    {
      icon: getIcon('stat-courses'),
      label: 'dashboard_metric_courses_registered',
      en: 'Enrolled',
      unit: UNITS.courses,
      value: stats.courses_registered,
      sub: trans('dashboard_metric_courses_registered_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-completed'),
      label: 'dashboard_metric_courses_completed',
      en: 'Completed',
      unit: UNITS.courses,
      value: stats.courses_completed,
      sub: trans('dashboard_metric_courses_completed_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-resources'),
      label: 'dashboard_metric_resources_published',
      en: 'Resources',
      unit: UNITS.count,
      value: stats.resources_published,
      sub: trans('dashboard_metric_resources_published_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-apps'),
      label: 'dashboard_metric_apps_published',
      en: 'Apps',
      unit: UNITS.count,
      value: stats.apps_published,
      sub: trans('dashboard_metric_apps_published_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-badges'),
      label: 'dashboard_metric_badges',
      en: 'Badges',
      unit: UNITS.badges,
      value: stats.badges,
      sub: trans('dashboard_metric_badges_sub', {}, 'widget'),
      na: false
    },
    {
      icon: getIcon('stat-attendance'),
      label: 'dashboard_metric_attendance',
      en: 'Attendance',
      unit: UNITS.pct,
      value: stats.attendance,
      bar: stats.attendance,
      sub: trans('dashboard_metric_attendance_sub', {}, 'widget'),
      na: null == stats.attendance
    }
  ]
}

// single metric card (data-driven, shared by the 12 metrics)
const StatCard = props => (
  <a
    className={`${PREFIX}-stat-card`}
    href="#"
    onClick={(event) => event.preventDefault()}
  >
    <div className="stat-top">
      <span className="stat-ico" aria-hidden="true"><i className={props.icon} /></span>
      <span className="stat-num">
        {props.na ? trans('dashboard_metric_na', {}, 'widget') : props.value}
        {!props.na && props.unit &&
          <span className="unit">{props.unit}</span>
        }
      </span>
    </div>
    <div className="stat-label">
      {trans(props.label, {}, 'widget')}
      <span className="en"> {props.en}</span>
    </div>
    <div className="stat-sub">{props.sub}</div>
    {null != props.bar &&
      <div className="stat-bar"><i style={{width: `${Math.min(100, Math.max(0, props.bar))}%`}} /></div>
    }
  </a>
)

StatCard.propTypes = {
  icon: T.string.isRequired,
  label: T.string.isRequired,
  en: T.string,
  unit: T.string,
  value: T.oneOfType([T.number, T.string]),
  sub: T.string,
  bar: T.number,
  na: T.bool
}

// greeting: time-period word + current user name (identity display, not a role check)
const Greeting = props => {
  const periodKey = (new Date()).getHours() < 12 ? 'dashboard_greeting_morning' : 'dashboard_greeting_afternoon'
  const separator = 'zh' === locale() ? '，' : ', '

  return (
    <div className={`${PREFIX}-greeting`}>
      <h2 className="greeting-title">{trans(periodKey, {}, 'widget')}{separator}{props.name}</h2>
      {props.sub &&
        <p className="greeting-sub">{trans(props.sub, {}, 'widget')}</p>
      }
    </div>
  )
}

Greeting.propTypes = {
  name: T.string,
  sub: T.string
}

// "shared area only" empty state (both stats groups null)
const BoardEmpty = () => (
  <div className="income-empty">
    <span className="ie-ico" aria-hidden="true"><i className="fas fa-fw fa-info-circle" /></span>
    <div>
      <div className="ie-title">{trans('dashboard_board_none_title', {}, 'widget')}</div>
      <div className="ie-desc">{trans('dashboard_board_none_desc', {}, 'widget')}</div>
    </div>
  </div>
)

const BoardComponent = props => {
  const currentUser = useCurrentUser()
  const parameters = props.parameters || {}
  const data = parameters.data || {}
  const stats = data.stats || {}
  const greeting = data.greeting || {}

  // the backend fills only the group of the current user's role (D9b)
  const group = stats.teacher ? 'teacher' : (stats.student ? 'student' : null)
  const showEmptyHint = parameters.showEmptyHint !== false

  if (!group) {
    // non-teacher/student role: double null -> empty state or hide the widget
    if (!showEmptyHint) {
      return null
    }

    return (
      <section className={PREFIX} aria-label={trans('dashboard_board_teacher', {}, 'widget')}>
        <BoardEmpty />
      </section>
    )
  }

  const isTeacher = 'teacher' === group
  const titleKey = isTeacher ? 'dashboard_board_teacher' : 'dashboard_board_student'
  const roleIcon = isTeacher ? 'fa-chalkboard-teacher' : 'fa-user-graduate'
  const cards = isTeacher ? teacherCards(stats.teacher) : studentCards(stats.student)

  return (
    <section className={PREFIX} aria-label={trans(titleKey, {}, 'widget')}>
      <div className={`${PREFIX}-head`}>
        <span className="role-ico" aria-hidden="true"><i className={`fas fa-fw ${roleIcon}`} /></span>
        <h2>{trans(titleKey, {}, 'widget')}</h2>
        <span className="en">{isTeacher ? 'Teacher Board' : 'Student Board'}</span>
      </div>

      <Greeting name={currentUser ? currentUser.name : ''} sub={greeting.sub} />

      <div className={`${PREFIX}-stat-rail`}>
        {cards.map(card => <StatCard key={card.label} {...card} />)}
      </div>

      <span className={`${PREFIX}-rail-hint`} aria-hidden="true">{trans('dashboard_board_rail_hint', {}, 'widget')}</span>
    </section>
  )
}

BoardComponent.propTypes = {
  parameters: T.shape({
    showEmptyHint: T.bool,
    data: T.shape({
      greeting: T.shape({
        sub: T.string
      }),
      stats: T.shape({
        teacher: T.object,
        student: T.object
      })
    })
  })
}

const Board = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(BoardComponent)

export {
  Board
}
