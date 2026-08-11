/*
 * Dashboard widget icon mapping (C-22).
 *
 * Font Awesome 5.15.4 solid classes, scoped to the dashboard widgets.
 * Decorative icons are rendered with aria-hidden="true" by the components.
 */

const ICONS = {
  // notifications (msg-*)
  'msg-course': 'fa fa-fw fa-bell',
  'msg-location': 'fa fa-fw fa-map-marker-alt',
  'msg-assignment': 'fa fa-fw fa-clock',
  'msg-other': 'fa fa-fw fa-bell',
  // recommendations (rec-*)
  'rec-resource': 'fa fa-fw fa-book',
  'rec-template': 'fa fa-fw fa-th-large',
  'rec-course': 'fa fa-fw fa-graduation-cap',
  // board (board-role / stat-*)
  'board-role': 'fa fa-fw fa-chalkboard-teacher',
  'stat-storage': 'fa fa-fw fa-database',
  'stat-usage': 'fa fa-fw fa-chart-line',
  'stat-resources': 'fa fa-fw fa-book',
  'stat-apps': 'fa fa-fw fa-layer-group',
  'stat-courses': 'fa fa-fw fa-graduation-cap',
  'stat-registrations': 'fa fa-fw fa-users',
  'stat-completed': 'fa fa-fw fa-check-circle',
  'stat-badges': 'fa fa-fw fa-medal',
  'stat-attendance': 'fa fa-fw fa-calendar-check',
  // shortcuts (sc-*)
  'sc-workspaces': 'fa fa-fw fa-archive',
  'sc-resources': 'fa fa-fw fa-book',
  'sc-catalog': 'fa fa-fw fa-graduation-cap',
  'sc-progress': 'fa fa-fw fa-chart-line',
  // income pending empty state
  'income-pending': 'fa fa-fw fa-credit-card'
}

function getIcon(key, fallback) {
  return ICONS[key] || fallback || ICONS['msg-other']
}

export {
  getIcon
}
