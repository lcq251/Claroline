import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

// template used by the collection "add item" button (spec §4.2.4)
const DEFAULT_ITEM = {
  label: '',
  en: '',
  icon: 'fa fa-fw fa-link',
  url: ''
}

function updateItemProp(item, prop, value) {
  return Object.assign({}, item, {[prop]: value})
}

/**
 * Edits a single shortcut tile (collection entry).
 */
const ShortcutItemEditor = props => {
  const item = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_shortcuts_item_label', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.label || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'label', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_shortcuts_item_en', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.en || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'en', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_shortcuts_item_icon', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.icon || 'fa fa-fw fa-link'}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'icon', event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{trans('dashboard_shortcuts_item_url', {}, 'widget')}</label>
        <input
          type="text"
          className="form-control"
          value={item.url || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateItemProp(item, 'url', event.target.value))}
        />
      </div>
    </div>
  )
}

ShortcutItemEditor.propTypes = {
  value: T.object,
  disabled: T.bool,
  onChange: T.func.isRequired
}

const ShortcutsParameters = props => (
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
            name: 'parameters.items',
            label: trans('dashboard_shortcuts_items', {}, 'widget'),
            type: 'collection',
            options: {
              button: trans('dashboard_shortcuts_items_add', {}, 'widget'),
              placeholder: trans('dashboard_shortcuts_items_empty', {}, 'widget'),
              defaultItem: DEFAULT_ITEM,
              component: ShortcutItemEditor
            }
          }
        ]
      }
    ]}
  />
)

ShortcutsParameters.propTypes = {
  name: T.string.isRequired
}

export {
  ShortcutsParameters
}
