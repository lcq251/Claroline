/*
 * dashboard-overview: 4 coloured cards with progress bars.
 * 资源/课程/工具/存储  —  each card shows 发布/订阅 (存储: 总额/使用).
 */

import React from 'react'
import PropTypes from 'prop-types'
import { trans } from '#/main/app/intl'

const PREFIX = 'overview-block'

const CARD_COLORS = {
  resources: '#dcfce7',
  courses:   '#dbeafe',
  tools:     '#f3e8ff',
  storage:   '#ccfbf1',
}

const PROGRESS_COLORS = {
  resources: '#22c55e',
  courses:   '#0ea5e9',
  tools:     '#a855f7',
  storage:   '#0d9488',
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0
  return (
    <div style={{ marginBottom: '8px' }}>
      <div
        style={{
          height: '6px',
          borderRadius: '3px',
          backgroundColor: 'rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '3px',
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}

function StatCard({ cardKey, icon, title, data }) {
  const bgColor = CARD_COLORS[cardKey] || '#ffffff'
  const barColor = PROGRESS_COLORS[cardKey] || '#5b9bd5'

  // storage card uses total/used labels
  let label1, label2, val1, val2
  if (cardKey === 'storage') {
    label1 = trans('dashboard_overview_storage_total', {}, 'widget')
    label2 = trans('dashboard_overview_storage_used', {}, 'widget')
    val1 = data.total ?? 0
    val2 = data.used ?? 0
  } else {
    label1 = trans('dashboard_overview_published', {}, 'widget')
    label2 = trans('dashboard_overview_subscribed', {}, 'widget')
    val1 = data.published ?? 0
    val2 = data.subscribed ?? 0
  }

  const max = Math.max(val1, val2, 1)

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px 8px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <span
          style={{
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.04)',
            color: barColor, fontSize: '18px',
          }}
        >
          <span className={icon} />
        </span>
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '12px', color: '#64748b', marginBottom: '2px',
        }}>
          <span>{label1}</span>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>
            {val1}{cardKey === 'storage' ? ' GB' : ''}
          </span>
        </div>
        <ProgressBar value={val1} max={max} color={barColor} />

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '12px', color: '#64748b', marginBottom: '2px',
        }}>
          <span>{label2}</span>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>
            {val2}{cardKey === 'storage' ? ' GB' : ''}
          </span>
        </div>
        <ProgressBar value={val2} max={max} color={barColor} />
      </div>
    </div>
  )
}

StatCard.propTypes = {
  cardKey: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
}

const OverviewBlock = props => {
  const rawData = (props.parameters && props.parameters.data) || {}

  const cards = [
    { key: 'resources', icon: 'fa fa-fw fa-file-text', title: trans('dashboard_overview_resources', {}, 'widget') },
    { key: 'courses',   icon: 'fa fa-fw fa-graduation-cap', title: trans('dashboard_overview_courses', {}, 'widget') },
    { key: 'tools',     icon: 'fa fa-fw fa-cogs', title: trans('dashboard_overview_tools', {}, 'widget') },
    { key: 'storage',   icon: 'fa fa-fw fa-database', title: trans('dashboard_overview_storage', {}, 'widget') },
  ]

  return (
    <section style={{ padding: '16px' }} aria-label={trans('dashboard_overview_title', {}, 'widget')}>
      <div
        className={`${PREFIX}-grid`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {cards.map(c => (
          <StatCard
            key={c.key}
            cardKey={c.key}
            icon={c.icon}
            title={c.title}
            data={rawData[c.key] || {}}
          />
        ))}
      </div>
    </section>
  )
}

OverviewBlock.propTypes = {
  parameters: PropTypes.object,
  context: PropTypes.string,
}

export { OverviewBlock }