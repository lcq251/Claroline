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
            type: 'html'
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
      }
    ]}
  />

LandingHeroParameters.propTypes = {
  name: T.string.isRequired
}

export {
  LandingHeroParameters
}
