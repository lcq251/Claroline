import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {constants as intlConstants} from '#/main/app/intl/constants'
import {trans} from '#/main/app/intl/translation'
import {CountryFlag} from '#/main/app/components/country-flag'
import {Contact} from '#/main/app/components/contact'

const PrivacySummary = props =>
  <div className={classes('bg-body-tertiary rounded-3 pt-3 p-4 d-flex flex-row align-items-stretch gap-4', props.className)}>
    <div className="flex-fill" role="presentation">
      <h2 className="page-section-title h6">
        {trans('dpo', {}, 'privacy')}
      </h2>

      <div className="d-flex flex-row align-items-baseline mb-2" role="presentation">
        <span className="fa fa-fw fa-user me-2" aria-hidden={true} />
        <span role="presentation">{props.dpo.name}</span>
      </div>
      <Contact {...props.dpo} className="mb-0" />
    </div>

    <div className="flex-fill d-flex flex-column" role="presentation">
      <h2 className="page-section-title h6">
        {trans('country_storage', {}, 'privacy')}
      </h2>

      <div className="d-flex flex-column align-items-center justify-content-center flex-fill" role="presentation">
        <CountryFlag
          countryCode={props.countryStorage}
          className="fs-1"
        />

        <span className="fs-4" role="presentation">
          {props.countryStorage ? intlConstants.REGIONS[props.countryStorage.toUpperCase()] : trans('empty_value') }
        </span>
      </div>
    </div>
  </div>

PrivacySummary.propTypes = {
  className: T.string,
  dpo: T.shape({
    name: T.string,
    email: T.string,
    address: T.shape({
      street1: T.string,
      street2: T.string,
      postalCode: T.string,
      city: T.string,
      state: T.string,
      country: T.string
    }),
    phone: T.string
  }),
  countryStorage: T.string
}

export {
  PrivacySummary
}
