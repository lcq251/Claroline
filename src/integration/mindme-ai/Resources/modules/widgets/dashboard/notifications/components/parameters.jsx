import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

// template used by the collection "add item" button (D10: demo fallback rows)
const DEFAULT_MESSAGE = {
  id: '',
  title: '',
  description: '',
  type: 'course',
  unread: false,
  time: '',
  url: ''
}

function updateItemProp(item, prop, value) {
  return Object.assign({}, item, {[prop]: value})
}

/**
 * Edits a single fallback message row (collection entry, D10).
 * These rows render when the serializer returns no real messages
 * (data.messages empty) — see main.jsx fallback contract.
 */
const MessageItemEditor = props => {
  const item = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="form-group">
        <label className="form-label">{trans('dashboard_notifications_item_title', {}, 'widget')}</label>
        <input
          type="text"
          className="form-control"
          value={item.title || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateItemProp(item, 'title', event.target.value))}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{trans('dashboard_notifications_item_description', {}, 'widget')}</label>
        <textarea
          className="form-control"
          rows={2}
          value={item.description || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateItemProp(item, 'description', event.target.value))}
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_notifications_item_type', {}, 'widget')}</label>
            <select
              className="form-select"
              value={item.type || 'course'}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'type', event.target.value))}
            >
              <option value="course">{trans('dashboard_msg_type_course', {}, 'widget')}</option>
              <option value="location">{trans('dashboard_msg_type_location', {}, 'widget')}</option>
              <option value="assignment">{trans('dashboard_msg_type_assignment', {}, 'widget')}</option>
              <option value="other">{trans('dashboard_msg_type_other', {}, 'widget')}</option>
            </select>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_notifications_item_time', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              placeholder="2026-08-11T02:30:00+08:00"
              value={item.time || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'time', event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_notifications_item_url', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.url || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'url', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-check-label d-block mb-1">{trans('dashboard_notifications_item_unread', {}, 'widget')}</label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={!!item.unread}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'unread', event.target.checked))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

MessageItemEditor.propTypes = {
  value: T.object,
  disabled: T.bool,
  onChange: T.func.isRequired
}

/**
 * dashboard-notifications parameters: maxItems (number) + showDescription
 * (bool) + messages (D10: demo fallback rows, rendered only when the
 * serializer has no real data).
 */
const NotificationsParameters = props => (
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
            label: trans('dashboard_notifications_maxItems', {}, 'widget'),
            type: 'number',
            default: 3
          },
          {
            name: 'parameters.showDescription',
            label: trans('dashboard_notifications_showDescription', {}, 'widget'),
            type: 'bool'
          },
          {
            name: 'parameters.messages',
            label: trans('dashboard_notifications_messages', {}, 'widget'),
            type: 'collection',
            options: {
              button: trans('dashboard_notifications_messages_add', {}, 'widget'),
              placeholder: trans('dashboard_notifications_messages_empty', {}, 'widget'),
              defaultItem: DEFAULT_MESSAGE,
              component: MessageItemEditor
            }
          }
        ]
      }
    ]}
  />
)

NotificationsParameters.propTypes = {
  name: T.string.isRequired
}

export {
  NotificationsParameters
}
