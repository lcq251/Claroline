/*
 * dashboard-fees widget (C-22): course fee list + income/cost sub card.
 *
 * data.fees[] + data.income are injected by the backend serializer. D10
 * fallback contract: when the serializer returns no fees, parameters.fees
 * (admin-editable demo rows) are rendered instead. The income card only has
 * two states (D3/U5): `pending` (billing not connected -> empty state, NEVER
 * a fake 0) and `ready` (two numeric cells).
 */

import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

import {BlockHead} from '../../common/block'

const PREFIX = 'claroline-distribution-integration-mindme-ai-dashboard-dashboard-fees'

// CNY display: ¥ prefix + thousands separator (spec §3.5)
function formatPrice(price) {
  const value = Number(price)

  if (isNaN(value)) {
    return ''
  }

  return `¥ ${value.toLocaleString('zh-CN')}`
}

const FeeRow = props => {
  const fee = props.fee || {}
  const status = fee.status || 'open'

  return (
    <div className="fee-row">
      {fee.url
        ? <a className="fee-name" href={fee.url}>{fee.course}</a>
        : <span className="fee-name">{fee.course}</span>
      }
      <span className="fee-price">{formatPrice(fee.price)}</span>
      <span className={`fee-status fee-status--${status}`}>{trans(`dashboard_fee_status_${status}`, {}, 'widget')}</span>
    </div>
  )
}

FeeRow.propTypes = {
  fee: T.shape({
    course: T.string,
    price: T.number,
    currency: T.string,
    status: T.string,
    url: T.string
  })
}

// income/cost sub card: pending empty state / ready numeric cells (two states only)
const IncomeCard = props => {
  const income = props.income || {}
  const status = income.status || 'pending'

  return (
    <div className="income-card">
      <div className="income-head">{trans('dashboard_income_title', {}, 'widget')}</div>

      {'ready' === status &&
        <div className="income-zeros">
          <div className="income-zero">
            <div className="iz-label">{trans('dashboard_income_label_income', {}, 'widget')}</div>
            <div className="iz-num">{formatPrice(income.income)}</div>
            <div className="iz-note">{trans('dashboard_income_note', {}, 'widget')}</div>
          </div>
          <div className="income-zero">
            <div className="iz-label">{trans('dashboard_income_label_cost', {}, 'widget')}</div>
            <div className="iz-num">{formatPrice(income.cost)}</div>
            <div className="iz-note">{trans('dashboard_income_note', {}, 'widget')}</div>
          </div>
        </div>
      }

      {'pending' === status &&
        <div className="income-empty">
          <span className="ie-ico" aria-hidden="true"><i className="fas fa-fw fa-credit-card" /></span>
          <div>
            <div className="ie-title">{trans('dashboard_income_pending_title', {}, 'widget')}</div>
            <div className="ie-desc">{trans('dashboard_income_pending_desc', {}, 'widget')}</div>
            <div className="ie-note">{trans('dashboard_income_note', {}, 'widget')}</div>
          </div>
        </div>
      }
    </div>
  )
}

IncomeCard.propTypes = {
  income: T.shape({
    status: T.string,
    income: T.number,
    cost: T.number
  })
}

const FeesComponent = props => {
  const parameters = props.parameters || {}
  const data = parameters.data || {}
  // D10 contract: serializer real data wins; when the backend has no
  // fees the parameters.fees demo rows are the fallback
  const fees = (Array.isArray(data.fees) && data.fees.length > 0)
    ? data.fees
    : (Array.isArray(parameters.fees) ? parameters.fees : [])
  const income = data.income || {status: 'pending', income: null, cost: null}
  const maxItems = parameters.maxItems || 3
  const list = fees.slice(0, maxItems)

  return (
    <section className={PREFIX} aria-label={trans('dashboard_block_fees', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_block_fees', {}, 'widget')}
        en="Course Fees"
        more={{label: trans('dashboard_more_fees', {}, 'widget'), url: '#/desktop/catalog'}}
      />

      <div className="fee-income">
        <div className="fee-card">
          {0 === list.length
            ? <div className="empty-row">{trans('dashboard_metric_na_title', {}, 'widget')}</div>
            : list.map((fee, index) => (
              <FeeRow key={index} fee={fee} />
            ))
          }
          <div className="fee-note">{trans('dashboard_fee_note', {}, 'widget')}</div>
        </div>

        <IncomeCard income={income} />
      </div>
    </section>
  )
}

FeesComponent.propTypes = {
  parameters: T.shape({
    maxItems: T.number,
    fees: T.arrayOf(T.object),
    data: T.shape({
      fees: T.arrayOf(T.object),
      income: T.object
    })
  })
}

const Fees = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(FeesComponent)

export {
  Fees
}
