import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

// template used by the collection "add item" button (D10: demo fallback rows)
const DEFAULT_FEE = {
  course: '',
  price: null,
  currency: 'CNY',
  status: 'open',
  url: ''
}

function updateItemProp(item, prop, value) {
  return Object.assign({}, item, {[prop]: value})
}

/**
 * Edits a single fallback fee row (collection entry, D10).
 * These rows render when the serializer returns no real fees
 * (data.fees empty) — see main.jsx fallback contract.
 */
const FeeItemEditor = props => {
  const item = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_fees_item_course', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.course || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'course', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_fees_item_price', {}, 'widget')}</label>
            <input
              type="number"
              className="form-control"
              value={null == item.price ? '' : item.price}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'price', '' === event.target.value ? null : Number(event.target.value)))}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_fees_item_currency', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.currency || 'CNY'}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'currency', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_fees_item_status', {}, 'widget')}</label>
            <select
              className="form-select"
              value={item.status || 'open'}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'status', event.target.value))}
            >
              <option value="open">{trans('dashboard_fee_status_open', {}, 'widget')}</option>
              <option value="started">{trans('dashboard_fee_status_started', {}, 'widget')}</option>
              <option value="soon">{trans('dashboard_fee_status_soon', {}, 'widget')}</option>
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_fees_item_url', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.url || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'url', event.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

FeeItemEditor.propTypes = {
  value: T.object,
  disabled: T.bool,
  onChange: T.func.isRequired
}

/**
 * dashboard-fees parameters: maxItems (number) + fees (D10: demo fallback
 * rows, rendered only when the serializer has no real data).
 * `income` has no parameter (its state is fully driven by data.income.status, D3/U5).
 */
const FeesParameters = props => (
  <FormContent
    level={5}
    flush={true}
    name={props.name}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'parameters.maxItems',
            label: trans('dashboard_fees_maxItems', {}, 'widget'),
            type: 'number',
            default: 3
          },
          {
            name: 'parameters.fees',
            label: trans('dashboard_fees_items', {}, 'widget'),
            type: 'collection',
            options: {
              button: trans('dashboard_fees_items_add', {}, 'widget'),
              placeholder: trans('dashboard_fees_items_empty', {}, 'widget'),
              defaultItem: DEFAULT_FEE,
              component: FeeItemEditor
            }
          }
        ]
      }
    ]}
  />
)

FeesParameters.propTypes = {
  name: T.string.isRequired
}

export {
  FeesParameters
}
