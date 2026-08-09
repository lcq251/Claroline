import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

/**
 * Editor for a single CTA button (label + platform route).
 * Used as the `component` of the `cta` collection field.
 */
const CtaItem = (props) =>
  <div className="d-flex flex-column gap-2">
    <input
      type="text"
      className="form-control"
      value={get(props.value, 'label', '')}
      placeholder={trans('landing_hero_cta_label', {}, 'widget')}
      aria-label={trans('landing_hero_cta_label', {}, 'widget')}
      disabled={props.disabled}
      onChange={(e) => props.onChange(Object.assign({}, props.value, {label: e.target.value}))}
    />
    <input
      type="text"
      className="form-control"
      value={get(props.value, 'href', '')}
      placeholder={trans('landing_hero_cta_href', {}, 'widget')}
      aria-label={trans('landing_hero_cta_href', {}, 'widget')}
      disabled={props.disabled}
      onChange={(e) => props.onChange(Object.assign({}, props.value, {href: e.target.value}))}
    />
  </div>

CtaItem.propTypes = {
  value: T.shape({
    label: T.string,
    href: T.string
  }),
  disabled: T.bool,
  onChange: T.func.isRequired
}

// Template used by the collection "add visual" button.
const DEFAULT_VISUAL = {
  icon: '',
  title: '',
  desc: ''
}

function updateVisualProp(visual, prop, value) {
  return Object.assign({}, visual, {[prop]: value})
}

/**
 * Edits a single visual entry (collection item).
 * Receives `value` (the visual object) and `onChange` from the collection input.
 */
const VisualItem = props => {
  const visual = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="form-group">
        <label className="form-label">{trans('landing_hero_visuals_icon', {}, 'widget')}</label>
        <input
          type="text"
          className="form-control"
          value={visual.icon || ''}
          placeholder="fa-fire"
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateVisualProp(visual, 'icon', event.target.value))}
        />
      </div>

      <div className="form-group mt-2">
        <label className="form-label">{trans('landing_hero_visuals_title', {}, 'widget')}</label>
        <input
          type="text"
          className="form-control"
          value={visual.title || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateVisualProp(visual, 'title', event.target.value))}
        />
      </div>

      <div className="form-group mt-2">
        <label className="form-label">{trans('landing_hero_visuals_desc', {}, 'widget')}</label>
        <textarea
          className="form-control"
          rows={2}
          value={visual.desc || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateVisualProp(visual, 'desc', event.target.value))}
        />
      </div>
    </div>
  )
}

VisualItem.propTypes = {
  value: T.shape({
    icon: T.string,
    title: T.string,
    desc: T.string
  }),
  disabled: T.bool,
  onChange: T.func.isRequired
}

/**
 * Hero widget configuration form.
 */
const LandingHeroParameters = (props) =>
  <FormContent
    level={5}
    flush={true}
    name={props.name}
    definition={[
      {
        title: trans('content'),
        primary: true,
        fields: [
          {
            name: 'parameters.title',
            label: trans('landing_hero_title', {}, 'widget'),
            type: 'string',
            required: true
          }, {
            name: 'parameters.subtitle',
            label: trans('landing_hero_subtitle', {}, 'widget'),
            type: 'string',
            options: {
              long: true
            }
          }, {
            name: 'parameters.story',
            label: trans('landing_hero_story', {}, 'widget'),
            type: 'html',
            help: trans('landing_hero_story_help', {}, 'widget')
          }, {
            name: 'parameters.visuals',
            label: trans('landing_hero_visuals', {}, 'widget'),
            type: 'collection',
            options: {
              component: VisualItem,
              placeholder: trans('landing_hero_visuals_empty', {}, 'widget'),
              button: trans('landing_hero_visuals_add', {}, 'widget'),
              defaultItem: DEFAULT_VISUAL
            },
            help: trans('landing_hero_visuals_help', {}, 'widget')
          }, {
            name: 'parameters.quote',
            label: trans('landing_hero_quote', {}, 'widget'),
            type: 'string',
            options: {
              long: true
            }
          }
        ]
      }, {
        title: trans('display_parameters'),
        fields: [
          {
            name: 'parameters.cta',
            label: trans('landing_hero_cta', {}, 'widget'),
            type: 'collection',
            options: {
              component: CtaItem,
              placeholder: trans('landing_hero_cta_empty', {}, 'widget'),
              button: trans('landing_hero_cta_add', {}, 'widget'),
              defaultItem: {
                label: '',
                href: ''
              }
            }
          }, {
            name: 'parameters.background',
            label: trans('landing_hero_background', {}, 'widget'),
            type: 'string',
            help: trans('landing_hero_background_help', {}, 'widget')
          }, {
            name: 'parameters.align',
            label: trans('landing_hero_align', {}, 'widget'),
            type: 'choice',
            options: {
              inline: true,
              choices: {
                left: trans('landing_hero_align_left', {}, 'widget'),
                center: trans('landing_hero_align_center', {}, 'widget'),
                right: trans('landing_hero_align_right', {}, 'widget')
              }
            }
          }, {
            name: 'parameters.stamp.enabled',
            label: trans('landing_hero_stamp_enabled', {}, 'widget'),
            type: 'boolean',
            linked: [
              {
                name: 'parameters.stamp.text',
                label: trans('landing_hero_stamp_text', {}, 'widget'),
                type: 'string',
                help: trans('landing_hero_stamp_text_help', {}, 'widget'),
                displayed: (data) => !!get(data, 'parameters.stamp.enabled')
              }
            ]
          }
        ]
      }, {
        title: trans('landing_hero_wechat', {}, 'widget'),
        fields: [
          {
            name: 'parameters.wechat.enabled',
            label: trans('landing_hero_wechat_enabled', {}, 'widget'),
            type: 'boolean',
            linked: [
              {
                name: 'parameters.wechat.image',
                label: trans('landing_hero_wechat_image', {}, 'widget'),
                type: 'string',
                help: trans('landing_hero_wechat_image_help', {}, 'widget'),
                displayed: (data) => !!get(data, 'parameters.wechat.enabled')
              }, {
                name: 'parameters.wechat.title',
                label: trans('landing_hero_wechat_title', {}, 'widget'),
                type: 'string',
                displayed: (data) => !!get(data, 'parameters.wechat.enabled')
              }, {
                name: 'parameters.wechat.hint',
                label: trans('landing_hero_wechat_hint', {}, 'widget'),
                type: 'string',
                options: {
                  long: true
                },
                displayed: (data) => !!get(data, 'parameters.wechat.enabled')
              }
            ]
          }
        ]
      }
    ]}
  />

LandingHeroParameters.propTypes = {
  name: T.string.isRequired
}

export {
  LandingHeroParameters
}
