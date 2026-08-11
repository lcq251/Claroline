import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

// template used by the collection "add item" button (spec §4.2.2)
const DEFAULT_ITEM = {
  id: '',
  title: '',
  desc: '',
  cover: null,
  icon: '',
  type: 'resource',
  tag: 'teacher',
  by: '',
  when: '',
  likes: 0,
  url: '',
  en: {title: '', desc: ''}
}

function updateItemProp(item, prop, value) {
  return Object.assign({}, item, {[prop]: value})
}

function updateEnProp(item, prop, value) {
  return Object.assign({}, item, {en: Object.assign({}, item.en || {}, {[prop]: value})})
}

/**
 * Edits a single recommendation item (collection entry).
 * `likes` is not exposed (U2: hard-coded 0 placeholder, feature is a separate plan).
 */
const RecommendationItemEditor = props => {
  const item = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_title', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.title || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'title', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_type', {}, 'widget')}</label>
            <select
              className="form-select"
              value={item.type || 'resource'}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'type', event.target.value))}
            >
              <option value="resource">{trans('dashboard_rec_type_resource', {}, 'widget')}</option>
              <option value="template">{trans('dashboard_rec_type_template', {}, 'widget')}</option>
              <option value="course">{trans('dashboard_rec_type_course', {}, 'widget')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{trans('dashboard_recommendations_item_desc', {}, 'widget')}</label>
        <textarea
          className="form-control"
          rows={2}
          value={item.desc || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateItemProp(item, 'desc', event.target.value))}
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_tag', {}, 'widget')}</label>
            <select
              className="form-select"
              value={item.tag || 'teacher'}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'tag', event.target.value))}
            >
              <option value="teacher">{trans('dashboard_rec_tag_teacher', {}, 'widget')}</option>
              <option value="platform">{trans('dashboard_rec_tag_platform', {}, 'widget')}</option>
            </select>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_icon', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.icon || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'icon', event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_cover', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.cover || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'cover', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_by', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.by || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'by', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_when', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={item.when || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateItemProp(item, 'when', event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('dashboard_recommendations_item_url', {}, 'widget')}</label>
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
            <label className="form-label">{trans('dashboard_recommendations_item_en', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              placeholder="title"
              value={(item.en && item.en.title) || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateEnProp(item, 'title', event.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

RecommendationItemEditor.propTypes = {
  value: T.object,
  disabled: T.bool,
  onChange: T.func.isRequired
}

const RecommendationsParameters = props => (
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
            name: 'parameters.showLikes',
            label: trans('dashboard_recommendations_showLikes', {}, 'widget'),
            help: trans('dashboard_recommendations_showLikes_help', {}, 'widget'),
            type: 'bool'
          },
          {
            name: 'parameters.items',
            label: trans('dashboard_recommendations_items', {}, 'widget'),
            type: 'collection',
            options: {
              button: trans('dashboard_recommendations_items_add', {}, 'widget'),
              placeholder: trans('dashboard_recommendations_items_empty', {}, 'widget'),
              defaultItem: DEFAULT_ITEM,
              component: RecommendationItemEditor
            }
          }
        ]
      }
    ]}
  />
)

RecommendationsParameters.propTypes = {
  name: T.string.isRequired
}

export {
  RecommendationsParameters
}
