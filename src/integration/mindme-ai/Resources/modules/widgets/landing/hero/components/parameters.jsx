import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

/**
 * Hero widget configuration form (C-14 浅色系).
 *
 * The first-screen hero keeps its four editable elements — equation title,
 * subtitle, the single CTA (label + route), the background — plus the new
 * top-bar copy: `topline` (top-left narrative) and the S1 seal (`stamp.enabled`
 * switch + `stamp.text`). The legacy `year` input was removed (the seal
 * replaces the year stamp; the component still falls back to `year` for
 * already-saved instances without a stamp parameter) and `brand` remains as a
 * backward-compatible fallback for instances without a topline.
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
            required: true,
            help: trans('landing_hero_title_help', {}, 'widget')
          }, {
            name: 'parameters.subtitle',
            label: trans('landing_hero_subtitle', {}, 'widget'),
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
            name: 'parameters.cta.label',
            label: trans('landing_hero_cta_label', {}, 'widget'),
            type: 'string'
          }, {
            name: 'parameters.cta.href',
            label: trans('landing_hero_cta_href', {}, 'widget'),
            type: 'string'
          }, {
            name: 'parameters.topline',
            label: trans('landing_hero_topline', {}, 'widget'),
            type: 'string',
            options: {
              long: true
            }
          }, {
            name: 'parameters.brand',
            label: trans('landing_hero_brand', {}, 'widget'),
            type: 'string'
          }, {
            name: 'parameters.stamp.enabled',
            label: trans('landing_hero_stamp_enabled', {}, 'widget'),
            type: 'boolean'
          }, {
            name: 'parameters.stamp.text',
            label: trans('landing_hero_stamp_text', {}, 'widget'),
            type: 'string'
          }, {
            name: 'parameters.background',
            label: trans('landing_hero_background', {}, 'widget'),
            type: 'string',
            help: trans('landing_hero_background_help', {}, 'widget')
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
