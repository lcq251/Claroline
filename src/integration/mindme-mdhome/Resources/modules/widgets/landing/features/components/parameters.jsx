import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

// Template used by the collection "add card" button.
const DEFAULT_CARD = {
  num: '',
  icon: 'fa fa-fw fa-flag',
  title: '',
  desc: '',
  en: '',
  href: '',
  tone: 'normal'
}

function updateCardProp(card, prop, value) {
  return Object.assign({}, card, {[prop]: value})
}

/**
 * Edits a single feature card (collection item).
 * Receives `value` (the card object) and `onChange` from the collection input.
 */
const FeatureCardEditor = props => {
  const card = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('landing_features_card_num', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={card.num || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateCardProp(card, 'num', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-8">
          <div className="form-group">
            <label className="form-label">{trans('landing_features_card_icon', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={card.icon || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateCardProp(card, 'icon', event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <label className="form-label">{trans('landing_features_card_title', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={card.title || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateCardProp(card, 'title', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label className="form-label">{trans('landing_features_card_tone', {}, 'widget')}</label>
            <select
              className="form-select"
              value={card.tone || 'normal'}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateCardProp(card, 'tone', event.target.value))}
            >
              <option value="normal">{trans('landing_features_card_tone_normal', {}, 'widget')}</option>
              <option value="soft">{trans('landing_features_card_tone_soft', {}, 'widget')}</option>
              <option value="dark">{trans('landing_features_card_tone_dark', {}, 'widget')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{trans('landing_features_card_desc', {}, 'widget')}</label>
        <textarea
          className="form-control"
          rows={2}
          value={card.desc || ''}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateCardProp(card, 'desc', event.target.value))}
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('landing_features_card_en', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={card.en || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateCardProp(card, 'en', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('landing_features_card_href', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={card.href || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateCardProp(card, 'href', event.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

FeatureCardEditor.propTypes = {
  value: T.object,
  disabled: T.bool,
  onChange: T.func.isRequired
}

const LandingFeaturesParameters = props => (
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
            label: trans('title'),
            type: 'string'
          },
          {
            name: 'parameters.subtitle',
            label: trans('landing_features_subtitle', {}, 'widget'),
            type: 'string'
          },
          {
            name: 'parameters.cards',
            label: trans('landing_features_cards', {}, 'widget'),
            type: 'collection',
            options: {
              button: trans('landing_features_add_card', {}, 'widget'),
              placeholder: trans('landing_features_no_card', {}, 'widget'),
              defaultItem: DEFAULT_CARD,
              component: FeatureCardEditor
            }
          }
        ]
      }
    ]}
  />
)

LandingFeaturesParameters.propTypes = {
  name: T.string.isRequired
}

export {
  LandingFeaturesParameters
}
