import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

// Template used by the collection "add button" button.
const DEFAULT_BUTTON = {
  label: '',
  href: '/login',
  primary: false
}

function updateButtonProp(button, prop, value) {
  return Object.assign({}, button, {[prop]: value})
}

/**
 * Edits a single CTA button (collection item).
 * Receives `value` (the button object) and `onChange` from the collection input.
 */
const CtaButtonEditor = props => {
  const button = props.value || {}

  return (
    <div className="border rounded p-3 bg-white">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('landing_cta_button_label', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={button.label || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateButtonProp(button, 'label', event.target.value))}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">{trans('landing_cta_button_href', {}, 'widget')}</label>
            <input
              type="text"
              className="form-control"
              value={button.href || ''}
              disabled={props.disabled}
              onChange={(event) => props.onChange(updateButtonProp(button, 'href', event.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="form-check form-switch mt-2">
        <input
          id="landing-cta-button-primary"
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={!!button.primary}
          disabled={props.disabled}
          onChange={(event) => props.onChange(updateButtonProp(button, 'primary', event.target.checked))}
        />
        <label className="form-check-label" htmlFor="landing-cta-button-primary">
          {trans('landing_cta_button_primary', {}, 'widget')}
        </label>
      </div>
    </div>
  )
}

CtaButtonEditor.propTypes = {
  value: T.object,
  disabled: T.bool,
  onChange: T.func.isRequired
}

const LandingCtaParameters = props => (
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
            label: trans('landing_cta_title', {}, 'widget'),
            type: 'string',
            required: true
          },
          {
            name: 'parameters.subtitle',
            label: trans('landing_cta_subtitle', {}, 'widget'),
            type: 'string',
            options: {
              long: true,
              minRows: 2
            }
          },
          {
            name: 'parameters.buttons',
            label: trans('landing_cta_buttons', {}, 'widget'),
            type: 'collection',
            options: {
              button: trans('landing_cta_add_button', {}, 'widget'),
              placeholder: trans('landing_cta_no_button', {}, 'widget'),
              defaultItem: DEFAULT_BUTTON,
              component: CtaButtonEditor
            }
          }
        ]
      }
    ]}
  />
)

LandingCtaParameters.propTypes = {
  name: T.string.isRequired
}

export {
  LandingCtaParameters
}
