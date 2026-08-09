import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormContent} from '#/main/app/content/form/containers/content'

/**
 * Hero widget configuration form (C-11 极简聚焦型).
 *
 * The first-screen hero is now minimal: only the four elements are editable —
 * equation title, subtitle, the single CTA (label + route), the background,
 * plus the top-bar copy (brand + year stamp). The legacy fields (story /
 * quote / visuals / wechat / stamp) were removed from the form; already-saved
 * widget instances keep their parameters but the component no longer renders
 * them.
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
            name: 'parameters.brand',
            label: trans('landing_hero_brand', {}, 'widget'),
            type: 'string'
          }, {
            name: 'parameters.year',
            label: trans('landing_hero_year', {}, 'widget'),
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
