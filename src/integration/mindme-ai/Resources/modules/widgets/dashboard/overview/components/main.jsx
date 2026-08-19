/*
 * dashboard-overview component: 4 cards (resources/courses/tools + subscriptions).
 */

import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

import {BlockHead} from '../../common/block'

const PREFIX = 'claroline-distribution-integration-mindme-ai-dashboard-dashboard-overview'

const OverviewComponent = props => {
  const params = props.parameters || {}
  const data = params.data || {}
  const res = data.resources || {}
  const cou = data.courses || {}
  const too = data.tools || {}
  const sub = data.subscriptions || {}

  const Card = ({title, en, rows}) => (
    <div className="ov-card">
      <BlockHead title={title} en={en} />
      {rows.map((r, i) => (
        <div key={i} className="ov-row">
          <span className="ov-num">{r.num}<span className="ov-unit"> {r.unit}</span></span>
          <span className="ov-label">{r.label}</span>
        </div>
      ))}
    </div>
  )

  return (
    <section className={PREFIX} aria-label={trans('dashboard_overview_title', {}, 'widget')}>
      <div className="ov-grid">
        <Card
          title={trans('dashboard_overview_resources', {}, 'widget')}
          en="Resources"
          rows={[
            {num: res.total ?? 0,      unit: trans('dashboard_overview_unit', {}, 'widget'), label: trans('dashboard_overview_total', {}, 'widget')},
            {num: res.published ?? 0,  unit: trans('dashboard_overview_unit', {}, 'widget'), label: trans('dashboard_overview_published', {}, 'widget')},
            {num: res.subscribed ?? 0, unit: trans('dashboard_overview_unit', {}, 'widget'), label: trans('dashboard_overview_subscribed', {}, 'widget')},
          ]}
        />
        <Card
          title={trans('dashboard_overview_courses', {}, 'widget')}
          en="Courses"
          rows={[
            {num: cou.total ?? 0,      unit: trans('dashboard_overview_unit_course', {}, 'widget'), label: trans('dashboard_overview_total', {}, 'widget')},
            {num: cou.published ?? 0,  unit: trans('dashboard_overview_unit_course', {}, 'widget'), label: trans('dashboard_overview_published', {}, 'widget')},
            {num: cou.subscribed ?? 0, unit: trans('dashboard_overview_unit_course', {}, 'widget'), label: trans('dashboard_overview_subscribed', {}, 'widget')},
          ]}
        />
        <Card
          title={trans('dashboard_overview_tools', {}, 'widget')}
          en="Tools"
          rows={[
            {num: too.total ?? 0,      unit: trans('dashboard_overview_unit', {}, 'widget'), label: trans('dashboard_overview_total', {}, 'widget')},
            {num: too.published ?? 0,  unit: trans('dashboard_overview_unit', {}, 'widget'), label: trans('dashboard_overview_published', {}, 'widget')},
            {num: too.subscribed ?? 0, unit: trans('dashboard_overview_unit', {}, 'widget'), label: trans('dashboard_overview_subscribed', {}, 'widget')},
          ]}
        />
        <div className="ov-card is-sub">
          <BlockHead title={trans('dashboard_overview_subscriptions', {}, 'widget')} en="Subscriptions" />
          <div className="ov-row"><span className="ov-num">{sub.resources ?? 0}<span className="ov-unit"> {trans('dashboard_overview_unit', {}, 'widget')}</span></span><span className="ov-label">{trans('dashboard_overview_resources', {}, 'widget')}</span></div>
          <div className="ov-row"><span className="ov-num">{sub.courses ?? 0}<span className="ov-unit"> {trans('dashboard_overview_unit_course', {}, 'widget')}</span></span><span className="ov-label">{trans('dashboard_overview_courses', {}, 'widget')}</span></div>
          <div className="ov-row"><span className="ov-num">{sub.tools ?? 0}<span className="ov-unit"> {trans('dashboard_overview_unit', {}, 'widget')}</span></span><span className="ov-label">{trans('dashboard_overview_tools', {}, 'widget')}</span></div>
          <div className="ov-total">合计订阅：<strong>{sub.total ?? 0}</strong></div>
        </div>
      </div>
    </section>
  )
}

OverviewComponent.propTypes = {
  parameters: T.shape({
    data: T.shape({
      resources: T.object,
      courses: T.object,
      tools: T.object,
      subscriptions: T.object
    })
  })
}

const Overview = connect(
  state => ({parameters: contentSelectors.parameters(state)})
)(OverviewComponent)

export {Overview}
