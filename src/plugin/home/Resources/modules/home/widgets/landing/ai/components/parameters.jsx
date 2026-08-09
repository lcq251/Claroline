import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

// Template used by the collection "add item" button.
const DEFAULT_ITEM = {
  icon: 'fa fa-fw fa-sparkles',
  name: '',
  desc: ''
}

function updateItemProp(item, prop, value) {
  return Object.assign({}, item, {[prop]: value})
}

/**
 * Edits a single AI capability item (collection item).
 * Receives `value` (the item object) and `onChange` from the collection input.
 */
const AiItemEditor = props => {
  const item = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('landing_ai_item_icon', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.icon || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'icon', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-8">
          <div className="form-group">
            <label className="form-label">{trans('landing_ai_item_name', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.name || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'name', event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{trans('landing_ai_item_desc', {}, 'widget')}</label>
        <textarea
          className="form-control"
          rows={2}
          value={item.desc || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateItemProp(item, 'desc', event.target.value))}
        />
      </div>
    </div>
  )
}

AiItemEditor.propTypes = {
  value: T.object,
  disabled: T.bool,
  onChange: T.func.isRequired
}

const LandingAiParameters = props => (
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
            name: 'parameters.title',
            label: trans('landing_ai_title', {}, 'widget'),
            type: 'string'
          },
          {
            name: 'parameters.badge',
            label: trans('landing_ai_badge', {}, 'widget'),
            type: 'string',
            options: {
              long: true
            }
          },
          {
            name: 'parameters.items',
            label: trans('landing_ai_items', {}, 'widget'),
            type: 'collection',
            options: {
              button: trans('landing_ai_add_item', {}, 'widget'),
              placeholder: trans('landing_ai_no_item', {}, 'widget'),
              defaultItem: DEFAULT_ITEM,
              component: AiItemEditor
            }
          }
        ]
      }
    ]}
  />
)

LandingAiParameters.propTypes = {
  name: T.string.isRequired
}

export {
  LandingAiParameters
}
